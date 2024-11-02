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

import OverwatchAPI from "overwatch-api";
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

            const platform = 'pc'; // pc/xbl/psn/nintendo-switch
            const region = 'kr';

            // get overwatch tier

            playerListEmbed.addFields({ name: req.body.member.user.global_name, value: 'your tier here', inline: false })

            return res.send({
                type:InteractionResponseType.UpdateMessage,
                data:{
                    // content:
                    embeds: [playerListEmbed],
                }
            })
        }

    }   

    // res.json({
    //     type: 4, // CHANNEL_MESSAGE_WITH_SOURCE 응답 타입
    //     data: {
    //         content: '버튼을 눌렀군요!',
    //         flags: 1 << 6 // ephemeral 플래그를 설정하여 유저에게만 보이도록 함
    //     }
    // });
}

export default OverwatchGameAPI


interface Players {
    id:string;
    tier:string
}


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