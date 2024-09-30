import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Request, Response } from "express";
import { ChoicesType, ChoiceType } from "../CommandOption/CommandOption";
import DiscordRequest from "../../util/discordRequest.ts";
import { HTTPMethod } from "../../util/httpMethod.ts";
import { verifiedEnv } from "../../util/verifyEnv.ts";

// return type in excuting against command
interface SplitCommandReturnType{
    excludeUser?:Array<string>;
    method?:"random" | "game",
    channel_number?:number,
    game?:"Overwatch" | "league of legends",
    randomForce?:boolean,
}

/** @TODO foo */
export const splitCommandHandler = async (req: Request, res: Response) => {
    const {guild_id} = req.body
    const data = req.body.data
    const options = data.options ?? [] as ChoicesType

    // transform options to obj
    const choices:SplitCommandReturnType = options.reduce((obj:{[key:string]:string | number}, option:ChoiceType) => {
        obj[option.name] = option.value
        return obj
    },{})

    // decisiotn tree
    // define game or random first
    if (choices["game"] === undefined){
        
        choices["method"] = "game" // if game API is usable
        choices["method"] = "random" // if there are no game API
    }
    if (choices['method'] === undefined){ 

        
    }
    const endPoint = `guilds/${guild_id}/members?limit=1000&with_presences=true`
    const members = await DiscordRequest(endPoint, {method:HTTPMethod.GET})
    .then((res) => res.json())
    .catch((err) => {throw Error(err)})

    members.forEach((member:any) => {
        console.log(member)
        console.log(`${member.user.username} is currently ${member.presence?.status || 'offline'}`);
    });

    
    // // conside parallel fetching
    // const endPoint = `/users/@me`
    // const connection = await DiscordRequest(endPoint, {method:HTTPMethod.GET})
    // .then((res) => res.json())
    // .catch((err) => {throw Error(err)})

    // console.log("connection",connection)
    


    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `hello world`,
        },
      });
}




// this.guild.shard.send({
//     op: GatewayOpcodes.RequestGuildMembers,
//     d: {
//       guild_id: this.guild.id,
//       presences,
//       user_ids: users,
//       query,
//       nonce,
//       limit,
//     },
//   });
