import { RequestHandler} from "express"
import Handler from "../Handler"
import { HTTPMethod } from "../../util/httpMethod.ts"
import {  InteractionResponseType, InteractionType } from "discord-interactions";
import { commandSpecification } from "../../manager/CommandManager.ts";
import splitHandler from "./split/splitHandler.ts";
import test from "./test/test.ts";
import gameAPI, { RegisteredGames } from "../../gameAPI/index.ts";
import getMessageIDs from "./functions/getMessageIDs.ts";
import splitEventHandler from "./split/splitMessage.ts";
import { gameCommandOption } from "../../command/gameCommandCollector.ts";
import optionsToObject from "../../util/discordUtil/choicesToObj.ts";
import { ResponseStrategyActionType } from "../../model/gameAPI/InteractionResponseExec.ts";


const applicationCommands:Record<typeof commandSpecification[number], RequestHandler> = {
    "test":test,
    "split":splitHandler,
    ...Object.entries(gameAPI).reduce((gameAPIObj:Record<RegisteredGames, RequestHandler>, [key, api]) => {
        gameAPIObj[key] = api.executeAction
        return gameAPIObj
    }, {})
}
function isCommand(commandName:any):commandName is typeof commandSpecification[number]{
    return commandSpecification.includes(commandName)
}


const messageComponents:Record<string, RequestHandler> = {
    "split":splitEventHandler,
    ...Object.entries(gameAPI).reduce((gameAPIObj:Record<string,RequestHandler>, [key, api]) => {
        gameAPIObj[key] = api.executeAction
        return gameAPIObj
    }, {})
}
function isMessageComponentHandler(componentID:string, messageID:string):boolean{
    return messageID in messageComponents && !!componentID;
}


const interactionClassifier:RequestHandler =  (req , res, next) => {
    
    // interaction type
    const { type, data} = req.body;
    
    if (type === InteractionType.PING){ // ping pong for regist discordAPP
        return res.send({ type: InteractionResponseType.PONG });

    } else if (type === InteractionType.APPLICATION_COMMAND){ // slash
        const commandName = data.name
        if(!isCommand(commandName)){throw Error("unknown command")}

        const options = data.options
        const optionsInformation:gameCommandOption = optionsToObject(options)
        if (optionsInformation['using'] === undefined){
            return res
        }

        req.body.action = {strategyName:optionsInformation['using'], action:ResponseStrategyActionType.Message}
        
        applicationCommands[commandName](req,res,next)

    } else if (type === InteractionType.MESSAGE_COMPONENT){
        const customID = data.custom_id

        const {messageID, componentID} = getMessageIDs(customID)
        if(!isMessageComponentHandler(componentID, messageID)){throw Error("unknown message component")}

        /**@TODO edit using componentID */
        req.body.action = {strategyName:componentID, action:ResponseStrategyActionType.Message}

        messageComponents[messageID](req,res,next)
    }
}

const interactionHandler: Handler = {}
interactionHandler[HTTPMethod.POST] = interactionClassifier

export default interactionHandler

