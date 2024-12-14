import { Request, Response } from "express";
import InteractionResponseStrategy from "../../model/gameAPI/InteractionResponseExec";
import TokenRedis from "../../util/TokenRedis";
import { makeAuthAllowComponent } from "../../handlers/interactions/components/OAuth";
import { APIEmbedField, ButtonStyle, ComponentType, ConnectionService,  EmbedBuilder, InteractionResponseType, Message, MessageFlags } from "discord.js";
import { makeInformUnknownComponent } from "../../handlers/interactions/components/infromConnect";
import OverwatchAPI, { Profile } from "overwatch-api";
import { generateCustomID, parseCustomID } from "../../util/customID";
import { extractNames, taggingNames } from "../../util/extractNames";
import { OverwatchPositions } from "../../handlers/interactions/games/overwatch/overwatch";
import GameAPI from "../../gameAPI/GameAPI";
import DiscordRequest from "../../util/discordRequest";
import { findConnection, getUserConnections } from "../../util/discordConnections";

abstract class SplitWithProfile<ProfileType> extends InteractionResponseStrategy {
    abstract connectionService:ConnectionService;
    abstract maxPeopleNumber: number | undefined;
    abstract game:GameAPI

    abstract getProfileWithConnectionID(id:string):Promise<ProfileType | null>
    abstract getRankFromProfile(profile:ProfileType):{rank:string} 
    

    handleCommand<T>(req: Request, res: Response, data?: T) {
        const user = req.body.member.user
        
        res.send(this.makeComponent(user.id))
        return
    }

    async handleMessage(req: Request, res: Response) {
        const customID = req.body.data.custom_id
        const [buttonID] = parseCustomID(customID, 2)
        if (buttonID === "interact"){
            await this.handleInteract(req,res)
        } else if (buttonID === "interactWithUnknown"){
            await this.handleInteractWithUnknown(req,res)
        }
    }

    private async handleInteractWithUnknown(req: Request, res: Response){
        // get origin message
        const urlForOrigin = `channels/${req.body.message.channel_id}/messages/${req.body.message.message_reference.message_id}`;
        const urlForEphmeral = `/webhooks/${req.body.application_id}/${req.body.token}/messages/${req.body.message.id}`;

        const originMessage = await DiscordRequest(urlForOrigin, { method: "GET" })
            .then((res) => res.json())
            .catch((err) => {
                console.log("Failed to fetch original message:", err);
                return null;  // 에러 시 null 반환
            });
        if (!originMessage || !originMessage.embeds || !originMessage.embeds[0]) {
            console.log("Original message or embeds not found");
            res.send(this.makeReplyComponent());
            return;
        }


        const currentUserID = req.body.member.user.id
        const playerListEmbed = EmbedBuilder.from(originMessage.embeds[0]);
        const { fieldIndex, userIndex } = findIndexInPlayerEmbed(currentUserID, playerListEmbed.data.fields)
        // when user is already in list
        if (userIndex > -1) {
            await DiscordRequest(urlForEphmeral, { method: "DELETE" }) 
            res.send(this.makeReplyComponent())
            return
        }

        const tierIndex = playerListEmbed.data.fields?.findIndex((field) => field.name === "unknown") ?? -1
        // when unknown field is not exist
        if (tierIndex === -1){
            playerListEmbed.addFields({name:"unknown", value:taggingNames(currentUserID)})
        } else {
            playerListEmbed.spliceFields(tierIndex,1,
            {
                name:"unknown", value:taggingNames(...extractNames(playerListEmbed.data.fields![tierIndex].value), currentUserID)
            })
        }
        // this.makeComponent(currentUserID, originMessage)
        originMessage.embeds[0] = playerListEmbed.toJSON()

        await DiscordRequest(urlForOrigin, { method: "PATCH", body: this.makeComponent(currentUserID, originMessage).data })
        res.send(this.makeReplyComponent())
        await DiscordRequest(urlForEphmeral, { method: "DELETE" }) 
        return
    }


    private async handleInteract(req: Request, res: Response){

        const currentUserID = req.body.member.user.id
        const currentMessage = req.body.message
        const playerListEmbed = EmbedBuilder.from(currentMessage.embeds[0])

        // find user in list & define join or leave
        const { fieldIndex, userIndex } = findIndexInPlayerEmbed(currentUserID, playerListEmbed.data.fields)
        if (userIndex > -1) { // delete user from playerList
            const fieldList: APIEmbedField[] = playerListEmbed.data.fields! // find userID in field => non null assertion
            
            const removedFieldStr = taggingNames(...extractNames(fieldList[fieldIndex].value).toSpliced(userIndex, 1))

            if (removedFieldStr) {
                fieldList[fieldIndex].value = removedFieldStr
                playerListEmbed.setFields(fieldList)
            } else {
                playerListEmbed.spliceFields(fieldIndex, 1)
            }
            currentMessage.embeds[0] = playerListEmbed.toJSON()

            res.send(this.makeComponent(currentUserID, currentMessage))

            return
        }

        // check accessToken
        const accessToken = await TokenRedis.getInstance().fetchToken(req.body.member.user.id)
        
        if (!accessToken) {
            res.send(makeAuthAllowComponent({ content: `need allow to access your profile for join ${this.game.gameName}` }))
            return
        }

        // check connection
        const connections = await getUserConnections(accessToken)
        const battleNetConnection = findConnection(connections, this.connectionService)
        if (!battleNetConnection) {
            res.send(makeInformUnknownComponent({ contentMessage: `need connection to ${this.connectionService} to join ${this.game.gameName}`, unknownButtonCustomID:generateCustomID(this.game.gameName, "splitWithTier", "interactWithUnknown") }))
            return
        }        
        
        // defer for crawling
        const deferredComponent = this.makeDeferredComponent()
        res.send(deferredComponent)


        const webhookID = currentMessage.webhook_id
        const webhookToken = req.body.token
        const messageID = req.body.message.id

        const urlForWebhook = `webhooks/${webhookID}/${webhookToken}`
        const urlForOrigin = `${urlForWebhook}/messages/${messageID}`
        const urlForEphmeral = `${urlForWebhook}/messages/@original`

        
        const profile = await this.getProfileWithConnectionID(battleNetConnection.id)
        // const profile = await this.getProfileWithConnectionID("시메원챔#3332")

        // if profile is private
        if (!profile) {
            const unknownComponent = makeInformUnknownComponent({ contentMessage: `profile is private`, unknownButtonCustomID:generateCustomID("overwatch", "splitWithTier", "interactWithUnknown") }).data
            await DiscordRequest(urlForWebhook, { method: "POST", body: unknownComponent })
            return
        }

        const { rank } = this.getRankFromProfile(profile)

        // add field current User
        const tierIndex = playerListEmbed.data.fields?.findIndex((field) => field.name === rank) ?? -1
        if (tierIndex === -1){
            playerListEmbed.addFields({name:rank, value:taggingNames(currentUserID)})
        } else {
            playerListEmbed.spliceFields(tierIndex,1,
                {
                    name:rank, 
                    value:taggingNames(...extractNames(playerListEmbed.data.fields![tierIndex].value), currentUserID)
                })
        }
        
        currentMessage.embeds[0] = playerListEmbed.toJSON()
       

        const userAddedComponent = this.makeComponent({ name: rank, value: currentUserID }, currentMessage).data
        await DiscordRequest(urlForOrigin, { method: "PATCH", body: userAddedComponent })
        await DiscordRequest(urlForEphmeral, { method: "DELETE" })
        
        return
    }

    private makeComponent(currentUser: APIEmbedField | string, message?: Message) {
        // basic embed
    
        const messageType = message === undefined ? InteractionResponseType.ChannelMessageWithSource : InteractionResponseType.UpdateMessage
        const emebds = message?.embeds ?? [this.game.basicEmbed]
        const currentUserID = (typeof currentUser === "string") ? currentUser : currentUser.value
        const requestedUserID = (message?.content && extractNames(message.content)[0]) ?? currentUserID
        
        return { 
            type: messageType,
            data: {
                content: `<@${requestedUserID}> request to split for ${this.game.gameName}\n\u200B`,
                embeds: emebds,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                style: ButtonStyle.Primary,
                                label: "interact",
                                custom_id: generateCustomID(this.game.gameName, "splitWithTier", "interact")
                            }
                        ]
                    }
                ]
            }
        }
    }

    private makeDeferredComponent(){ 
        return {
            type:InteractionResponseType.DeferredChannelMessageWithSource,
            data:{
                content:"in processing...",
                flags:MessageFlags.Ephemeral
            }
        }
    }

    private makeReplyComponent(){
        return {
            type:InteractionResponseType.UpdateMessage,
            data:{} // nothing
        }
    }

    

}


export default SplitWithProfile


function findIndexInPlayerEmbed(userID: string, playerList: APIEmbedField[] = []) {
    let userIndex = -1
    const fieldIndex = playerList.findIndex((field) => {
        userIndex = extractNames(field.value).findIndex((plyaerID) => plyaerID === userID)
        return userIndex > -1
    })

    return { fieldIndex, userIndex }
}


