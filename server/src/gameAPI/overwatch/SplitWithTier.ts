import { Request, Response } from "express";
import InteractionResponseStrategy from "../../model/gameAPI/InteractionResponseExec";
import TokenRedis from "../../util/TokenRedis";
import { makeAuthAllowComponent } from "../../handlers/interactions/components/OAuth";
import getUserConnections from "../../handlers/interactions/functions/getUserConnections";
import findConnection from "../../handlers/interactions/functions/filterConnection";
import { APIEmbedField, ButtonStyle, ComponentType, ConnectionService,  EmbedBuilder, InteractionResponseType, Message, MessageFlags } from "discord.js";
import { makeInformUnknownComponent } from "../../handlers/interactions/components/infromConnect";
import OverwatchAPI, { Profile } from "overwatch-api";
import { generateCustomID, parseCustomID } from "../../util/customID";
import { extractNames, taggingNames } from "../../util/extractNames";
import { RankKey, rankScore } from "..";
import { OverwatchPositions } from "./overwatch";
import GameAPI from "../GameAPI";
import DiscordRequest from "../../util/discordRequest";


class SplitWithTier extends InteractionResponseStrategy {
    game:GameAPI
    constructor(game:GameAPI){
        super()
        this.game = game
    }

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
        const ephemeralMessage = req.body.message // epermal message
        const referenceMessageInfo = ephemeralMessage.message_reference
        console.log("ephemeralMessage", req.body)
        if (!referenceMessageInfo) {
            res.send(this.makeReplyComponent())
            // somthing wrong
            return
        }

        // define seeds
        const currentUserID = req.body.member.user.id
        const originMessageID = referenceMessageInfo.message_id

        // get origin message
        // const urlForOrigin = `webhooks/${webhookID}/${webhookToken}/messages/@original`;
        const urlForOrigin = `channels/${ephemeralMessage.channel_id}/messages/${originMessageID}`;
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


        const playerListEmbed = EmbedBuilder.from(originMessage.embeds[0]);
        const originMessageWebhookID = originMessage.webhook_id
        const originMessageWebhookToken = originMessage.token

        // const urlForWebhook = `webhooks/${webhookID}/${webhookToken}`
        // const urlForOrigin = `${urlForWebhook}/messages/${messageID}`
        // const urlForFollowUp = `${urlForWebhook}/messages/@original`

        const { fieldIndex, userIndex } = findIndexInPlayerEmbed(currentUserID, playerListEmbed.data.fields)
        // when user is already in list
        if (userIndex > -1) {
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
            res.send(makeAuthAllowComponent({ content: `need allow to access your profile for join overwatch` }))
            return
        }

        // check connection
        const connections = await getUserConnections(accessToken)
        const battleNetConnection = findConnection(connections, ConnectionService.BattleNet)
        if (!battleNetConnection) {
            res.send(makeInformUnknownComponent({ contentMessage: `need connection to ${ConnectionService.BattleNet} to join overwatch`, unknownButtonCustomID:generateCustomID("overwatch", "splitWithTier", "interactWithUnknown") }))
            return
        }


        const webhookID = currentMessage.webhook_id
        const webhookToken = req.body.token
        const messageID = req.body.message.id

        const urlForWebhook = `webhooks/${webhookID}/${webhookToken}`
        const urlForOrigin = `${urlForWebhook}/messages/${messageID}`
        const urlForFollowUp = `${urlForWebhook}/messages/@original`
        
        
        // check with defer for crawling
        const deferredComponent = this.makeDeferredComponent()
        res.send(deferredComponent)

        
        const profile = await getOverwatchProfile(battleNetConnection.id)
        // const profile = await getOverwatchProfile("시메원챔#3332")
        // if profile is private
        if (!profile) {
            const originComponent = this.makeComponent(currentUserID, currentMessage)
            await DiscordRequest(urlForOrigin, { method: "PATCH", body: originComponent })
            const unknownComponent = makeInformUnknownComponent({ contentMessage: `profile is private`, unknownButtonCustomID:generateCustomID("overwatch", "splitWithTier", "interactWithUnknown") }).data
            await DiscordRequest(urlForWebhook, { method: "POST", body: unknownComponent })
            return
        }

        const { rankStr } = calcRank(profile)

        // add field current User
        const tierIndex = playerListEmbed.data.fields?.findIndex((field) => field.name === rankStr) ?? -1
        if (tierIndex === -1){
            playerListEmbed.addFields({name:rankStr, value:taggingNames(currentUserID)})
        } else {
            playerListEmbed.spliceFields(tierIndex,1,
                {
                    name:rankStr, 
                    value:taggingNames(...extractNames(playerListEmbed.data.fields![tierIndex].value), currentUserID)
                })
        }
        
        currentMessage.embeds[0] = playerListEmbed.toJSON()
       
        console.log(req.body)

        const userAddedComponent = this.makeComponent({ name: rankStr, value: currentUserID }, currentMessage).data
        await DiscordRequest(urlForOrigin, { method: "PATCH", body: userAddedComponent })
        await DiscordRequest(urlForFollowUp, { method: "DELETE" })
        
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
                content: `<@${requestedUserID}> request to split for overwatch\n\u200B`,
                embeds: emebds,
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                style: ButtonStyle.Primary,
                                label: "interact",
                                custom_id: generateCustomID("overwatch", "splitWithTier", "interact")
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


export default SplitWithTier


function findIndexInPlayerEmbed(userID: string, playerList: APIEmbedField[] = []) {
    let userIndex = -1
    const fieldIndex = playerList.findIndex((field) => {
        userIndex = extractNames(field.value).findIndex((plyaerID) => plyaerID === userID)
        return userIndex > -1
    })

    return { fieldIndex, userIndex }
}

function getOverwatchProfile(battleTag: string): Promise<Profile | null> {
    const formattedTag = battleTag.replace('#', '-');
    const platform = 'pc';
    const region = 'kr';
    
    return new Promise<Profile | null>((resolve, reject) => {
        OverwatchAPI.getProfile(platform, region, formattedTag, (err, json) => {
            if (err) {
                // API 에러 처리
                resolve(null); // 또는 reject(`Error fetching profile: ${err.message}`);
            } else {
                resolve(json);
            }
        });
    }).catch(error => {
        console.error(error);
        return null;
    });
}



interface RankObj {
    position: OverwatchPositions,
    rank: string
}

// get highest score with tier
function calcRank(profile: any):{rankStr:RankKey, score:number} {

    // library wrong => edit number to string
    // there are no open tier
    const ranks: RankObj[] = [
        { position: OverwatchPositions.Tank, rank: profile.competitive?.tank?.rank },
        { position: OverwatchPositions.Offense, rank: profile.competitive?.offense?.rank },
        { position: OverwatchPositions.Support, rank: profile.competitive?.support?.rank },
        { position: OverwatchPositions.Open, rank: profile.competitive?.open?.rank }
    ]


    const calcObj = ranks.reduce((obj: { rankStr: RankKey, score: number }, curr) => {
        const rankStr = extractRank(curr.rank)
        const calcValue = convertRank(rankStr)
        return calcValue > obj.score ? { rankStr: rankStr, score: calcValue } : obj
    }, { rankStr: 'Unknown', score: 0 })

    return calcObj
}

function extractRank(rankString?: string): RankKey {
    if (!rankString) return 'Unknown'
    const rank = rankString.split(" ")[0].split("_")[1]
    return rank as RankKey
}
function convertRank(rank?: string): number {
    if (!rank) return 0
    if (!(rank in rankScore)) return 0
    return rankScore[rank as RankKey]
}
