import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Request, Response } from "express";
import { ChoicesType, ChoiceType } from "../CommandOption/CommandOption";
import DiscordRequest from "../../util/discordRequest.ts";
import { HTTPMethod } from "../../util/httpMethod.ts";

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

    // conside parallel fetching
    const endPoint = `/users/@me`
    const connection = await DiscordRequest(endPoint, {method:HTTPMethod.GET})
    .then((res) => res.json())
    .catch((err) => {throw Error(err)})

    console.log("connection",connection)
    


    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `hello world`,
        },
      });
}



