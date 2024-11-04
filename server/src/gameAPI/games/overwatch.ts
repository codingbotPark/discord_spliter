import { Request, RequestHandler, Response } from "express";
import GameAPI from "../GameAPI";
import { makeAuthAllowComponent } from "../../handlers/interactions/components/OAuth.ts";
import TokenRedis from "../../util/TokenRedis.ts";
import DiscordRequest from "../../util/discordRequest.ts";
import { HTTPMethod } from "../../util/httpMethod.ts";
import getUserConnections from "../../handlers/interactions/functions/getUserConnections.ts";
import findConnection from "../../handlers/interactions/functions/filterConnection.ts";
import { ButtonStyle, ComponentType, ConnectionService, EmbedBuilder, InteractionResponseType, MessageType } from "discord.js";
import { makeInformConnectionComponent } from "../../handlers/interactions/components/infromConnect.ts";
import getMessageIDs from "../../handlers/interactions/functions/getMessageIDs.ts";
import { verifiedEnv } from "../../util/verifyEnv.ts";
import OverwatchAPI, { Profile } from "overwatch-api";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const overwatch = require('overwatch-api');



class OverwatchGameAPI implements GameAPI{
    async splitWithTier(req: Request, res: Response) {
        const user = req.body.member.user

        return res.send(makePlayerListComponent(user.id))
        // const accessToken = await TokenRedis.getInstance().fetchToken(req.body.member.user.id)

        // if (!accessToken){
        //     return res.send(makeAuthAllowComponent({content:`need allow to access your profile`}))
        // }

        // const connections = await getUserConnections(accessToken)
        // const battleNetConnection = findConnection(connections, ConnectionService.BattleNet)

        // if (!battleNetConnection){
        //     return res.send(makeInformConnectionComponent({connectionService:ConnectionService.BattleNet}))
        // }
    }

    async eventHandler(req:Request,res:Response){
        // ex) overwatch_splitWithTier
        const {componentID} = getMessageIDs(req.body.data.custom_id)

        if (componentID === "splitWithTier"){

            const accessToken = await TokenRedis.getInstance().fetchToken(req.body.member.user.id)

            if (!accessToken){
                return res.send(makeAuthAllowComponent({content:`need allow to access your profile for join overwatch`}))
            }
    
            const connections = await getUserConnections(accessToken)
            const battleNetConnection = findConnection(connections, ConnectionService.BattleNet)
    
            if (!battleNetConnection){
                return res.send(makeInformConnectionComponent({connectionService:ConnectionService.BattleNet}))
            }

            const currentEmbeds = req.body.message.embeds
            const playerListEmbed = new EmbedBuilder(currentEmbeds[0])

            if (!currentEmbeds[0]){
                playerListEmbed.setTitle("overwatch players")
            }

            const profile = await getOverwatchProfile(battleNetConnection.id)
            // console.log(profile.competitive.damage.rank)
            // select highest tier
            const {rankStr, score} = calcRank(profile)

            playerListEmbed.addFields({ name: req.body.member.user.global_name, value: rankStr, inline: false })

            return res.send({
                type:InteractionResponseType.UpdateMessage,
                data:{
                    // content:
                    embeds: [playerListEmbed],
                }
            })
        }

    }   
}

export default OverwatchGameAPI


interface Players {
    id:string;
    tier:string
}


function getOverwatchProfile(battleTag:string):Promise<Profile> {
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

const enum OverwatchPositions {
    Tank = "tank",
    Offense = "offense",
    Support = "support",
    Open = "open",
    Unknown = "unknown"
}
interface RankObj {
    position:OverwatchPositions,
    rank:string
}

// get highest score with tier
function calcRank(profile:any){
    // library wrong => edit number to string
    // there are no open tier
    const ranks:RankObj[] = [
        {position:OverwatchPositions.Tank ,rank:profile.competitive?.tank?.rank}, 
        {position:OverwatchPositions.Offense ,rank:profile.competitive?.offense?.rank},
        {position:OverwatchPositions.Support ,rank:profile.competitive?.support?.rank}
    ]

    
    const calcObj = ranks.reduce((obj:{rankStr:RankKey, score:number}, curr) => {
        const rankStr = extractRank(curr.rank)
        const calcValue = convertRank(rankStr)
        return calcValue > obj.score ? {rankStr:rankStr, score:calcValue} : obj
    }, {rankStr:'Unknown', score:0})
    
    return calcObj
}

function extractRank(rankString?:string):RankKey{
    if (!rankString) return 'Unknown'
    const rank = rankString.split(" ")[0].split("_")[1]
    return rank as RankKey
}
function convertRank(rank?:string):number{
    if (!rank) return 0
    if (!(rank in rankScore)) return 0
    return rankScore[rank]
}

const rankScore:{ [key: string]: number } = {
    'Unknown':0,
    'Bronze':1,
    'Silver':2,
    'Gold':4,
    'Platinum':6,
    'Diamond':9,
    'Master':11,
    'Grandmaster':14
} as const
type RankKey = Extract<keyof typeof rankScore, string>;


// 나중엔 tier를 점수화 한 후, splitWithTier 로직을 동일하게 상용하기
function makePlayerListComponent(userID:string, players:Players[] = []){

    let playerListString = ""
    if (!!players.length){
        playerListString = players.map((player, idx) => `${idx}. <@${player.id}> ${player.tier}\n`).join("") + "\u200B"
    }

    return {
        type:InteractionResponseType.ChannelMessageWithSource,
        data:{
            content:`<@${userID}> request to split for overwatch\n\u200B\n${playerListString}`,
            components:[
                {
                    type:ComponentType.ActionRow,
                    components:[
                        {
                            type:ComponentType.Button,
                            style:ButtonStyle.Primary,
                            label:"join",
                            custom_id:"overwatch_splitWithTier"
                        }
                    ]
                }
            ]
        }
    }
}




// connection ex
// [
//     {
//       "id": "1234567890",
//       "name": "YourBattleNetUsername#1234",
//       "type": "battlenet",
//       "verified": true,
//       "friend_sync": false,
//       "show_activity": true,
//       "visibility": 1
//     },
//     ...
//   ]