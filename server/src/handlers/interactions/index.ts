import { Request, RequestHandler} from "express"
import Handler, { MessageComponentObj } from "../Handler"
import { HTTPMethod } from "../../util/httpMethod.ts"
import {  InteractionResponseType, InteractionType } from "discord-interactions";
import { commandSpecification } from "../../manager/CommandManager.ts";
import splitHandler from "./split/splitHandler.ts";
import splitMessageComponent from "./split/splitMessage.ts";
import test from "./test/test.ts";
import gameHandler from "./game/gameHandler.ts";
import gameAPI, { RegisteredGames } from "../../gameAPI/index.ts";


const applicationCommands:Record<typeof commandSpecification[number], RequestHandler> = {
    "test":test,
    "split":splitHandler,
    ...Object.keys(gameAPI).reduce((gameAPIObj:Record<RegisteredGames, RequestHandler>, curr:string) => {
        gameAPIObj[curr] = gameHandler
        return gameAPIObj
    }, {})
}
function isCommand(commandName:any):commandName is typeof commandSpecification[number]{
    return commandSpecification.includes(commandName)
}


const messageComponents:Record<string, MessageComponentObj> = {
    "split":splitMessageComponent
}
function getMessageIDs(customID:string){
    const [messageID, ...componentIDParts] = customID.split("_");
    if (!messageID || !componentIDParts.length) throw Error("Invalid customID");

    const componentID = componentIDParts.join("_");

    return {componentID, messageID}
}
function isMessageComponentHandler(componentID:string, messageID:string):boolean{
    return messageID in messageComponents && componentID in messageComponents[messageID];
}


const interactionClassifier:RequestHandler =  (req , res, next) => {
    
    // interaction type
    const { type, data} = req.body;
    
    if (type === InteractionType.PING){ // ping pong for regist discordAPP
        return res.send({ type: InteractionResponseType.PONG });

    } else if (type === InteractionType.APPLICATION_COMMAND){ // slash
        const commandName = data.name

        if(!isCommand(commandName)){throw Error("unknown command")}
        applicationCommands[commandName](req,res,next)

    } else if (type === InteractionType.MESSAGE_COMPONENT){
        const customID = data.custom_id
        
        const {componentID, messageID} = getMessageIDs(customID)
        if(!isMessageComponentHandler(componentID, messageID)){throw Error("unknown message component")}

    }
}

const interactionHandler: Handler = {}
interactionHandler[HTTPMethod.POST] = interactionClassifier

export default interactionHandler

