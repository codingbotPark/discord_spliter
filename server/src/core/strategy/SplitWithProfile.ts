import { Request, Response } from "express";
import InteractionResponseStrategy from "../../model/gameAPI/InteractionResponseExec";
import TokenRedis from "../../util/TokenRedis";
import { makeAuthAllowComponent } from "../../handlers/interactions/components/OAuth";
import { APIEmbedField, ButtonStyle, ComponentType, ConnectionService,  EmbedBuilder, InteractionResponseType, Message, MessageFlags } from "discord.js";
import { makeInformUnknownComponent } from "../../handlers/interactions/components/infromConnect";
import { generateCustomID, parseCustomID } from "../../util/customID";
import { extractNames, taggingNames } from "../../util/extractNames";
import GameAPI from "../../gameAPI/GameAPI";
import DiscordRequest from "../../util/discordRequest";
import { findConnection, getUserConnections } from "../../util/discordConnections";
import { Player } from "../system/RankSystem";

abstract class SplitWithProfile<ProfileType> extends InteractionResponseStrategy {
    abstract connectionService:ConnectionService;
    abstract maxPeopleNumber: number | undefined;
    abstract game:GameAPI

    abstract getProfileWithConnectionID(id:string):Promise<ProfileType | null>
    abstract getRankFromProfile(profile:ProfileType):{rank:string} 
    abstract splitCoreLogic(players:Player[]):Array<Player[]>
    

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
        } else if (buttonID === "split"){
            await this.handleSplit(req, res)
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

        const tierIndex = playerListEmbed.data.fields?.findIndex((field) => field.name === "Unknown") ?? -1
        // when unknown field is not exist
        if (tierIndex === -1){
            playerListEmbed.addFields({name:"Unknown", value:taggingNames(currentUserID)})
        } else {
            playerListEmbed.spliceFields(tierIndex,1,
            {
                name:"Unknown", value:taggingNames(...extractNames(playerListEmbed.data.fields![tierIndex].value), currentUserID)
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

    private async handleSplit(req:Request, res:Response){
        const currentMessage = req.body.message
        const playerListEmbed = EmbedBuilder.from(currentMessage.embeds[0])

        const players:Player[] | undefined = playerListEmbed.data.fields?.flatMap((field) => 
            extractNames(field.value).map((id) => ({userID:id, rank:field.name})))

        // there are no players
        if (!players) return

        const splittedPlayers = this.splitCoreLogic(players) 

        res.send(this.makePlayerListComponent(splittedPlayers))
        return 
    }

    private makePlayerListComponent(players:Array<Player[]>, message?:Message){
        const embeds = message?.embeds ?? [this.game.basicEmbed]
        const embedBuilder = EmbedBuilder.from(embeds[0])

        const fields = players.flatMap((playerGroup, idx) => (
            [{
                name:`Group ${idx + 1}`,
                value:playerGroup.map((player) => `<@${player.userID}>`).join("\n"),
                inline:true
            },{
                name:"\u0009",
                value:"\u0009",
                inline:true
            }]
        ))

        // clear embeds & set with players
        embedBuilder.setFields(fields)
        embeds[0] = embedBuilder.toJSON()

        return {
            type:InteractionResponseType.UpdateMessage,
            data:{
                embeds:embeds,
                components:[
                    {
                        type:ComponentType.ActionRow,
                        components:[
                            {
                                type:ComponentType.Button,
                                style:ButtonStyle.Primary,
                                label:"Accept",
                                custom_id: generateCustomID(this.game.gameName, "splitWithTier", "acceptSplit")
                            },{
                                type:ComponentType.Button,
                                style:ButtonStyle.Danger,
                                label:"Cancel",
                                custom_id: generateCustomID(this.game.gameName, "splitWithTier", "cancelSplit")
                            },
                        ]
                    }
                ]
            }
        }
    }

    private makeComponent(currentUser: APIEmbedField | string, message?: Message) {
        // basic embed
    
        const messageType = message === undefined ? InteractionResponseType.ChannelMessageWithSource : InteractionResponseType.UpdateMessage
        const embeds = message?.embeds ?? [this.game.basicEmbed]
        const currentUserID = (typeof currentUser === "string") ? currentUser : currentUser.value
        const requestedUserID = (message?.content && extractNames(message.content)[0]) ?? currentUserID
        
        return { 
            type: messageType,
            data: {
                content: `<@${requestedUserID}> request to split for ${this.game.gameName}\n\u200B`,
                embeds: embeds,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                style: ButtonStyle.Primary,
                                label: "interact",
                                custom_id: generateCustomID(this.game.gameName, "splitWithTier", "interact")
                            }, {
                                type:ComponentType.Button,
                                style:ButtonStyle.Secondary,
                                label:"split",
                                custom_id:generateCustomID(this.game.gameName, "splitWithTier", "split")
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


