import { Request, Response } from "express";
import InteractionResponseStrategy from "../../model/gameAPI/InteractionResponseExec";
import TokenRedis from "../../util/TokenRedis";
import { makeAuthAllowComponent } from "../../handlers/interactions/components/OAuth";
import getUserConnections from "../../handlers/interactions/functions/getUserConnections";
import findConnection from "../../handlers/interactions/functions/filterConnection";
import { APIEmbedField, ButtonStyle, ComponentType, ConnectionService, Embed, EmbedAssertions, EmbedBuilder, EmbedField, InteractionResponseType, Message } from "discord.js";
import { makeInformConnectionComponent } from "../../handlers/interactions/components/infromConnect";
import OverwatchAPI, { Profile } from "overwatch-api";
import { generateCustomID, parseCustomID } from "../../util/customID";
import { extractNames, taggingNames } from "../../util/extractNames";
import { RankKey, rankScore } from "..";
import { OverwatchPositions } from "./overwatch";
import GameAPI from "../GameAPI";


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

        const currentUserID = req.body.member.user.id
        const currentMessage = req.body.message
        const playerListEmbed = EmbedBuilder.from(currentMessage.embeds[0])

        // find user in list & define join or leave
        const { fieldIndex, userIndex } = findIndexInPlayerEmbed(currentUserID, playerListEmbed.data.fields)
        if (userIndex > -1) { // delete user from playerList
            const fieldList: APIEmbedField[] = playerListEmbed.data.fields! // find userID in field => non null assertion
            
            const removedFieldStr = taggingNames(...extractNames(fieldList[fieldIndex].value).toSpliced(userIndex, 1))

            console.log(extractNames(removedFieldStr), currentUserID)

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
            res.send(makeInformConnectionComponent({ connectionService: ConnectionService.BattleNet }))
            return
        }

        // use overwatch api
        const profile = await getOverwatchProfile(battleNetConnection.id)
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
        
        res.send(this.makeComponent({ name: rankStr, value: currentUserID }, currentMessage))
        
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

function getOverwatchProfile(battleTag: string): Promise<Profile> {
    return new Promise((resolve, reject) => {
        const formattedTag = battleTag.replace('#', '-');
        const platform = 'pc';
        const region = 'kr';

        OverwatchAPI.getProfile(platform, region, formattedTag, (err, json) => {
            if (err) {
                reject(`Error fetching profile:, ${err.message}`);
            } else {
                resolve(json)
            }
        });
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
        { position: OverwatchPositions.Support, rank: profile.competitive?.support?.rank }
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




