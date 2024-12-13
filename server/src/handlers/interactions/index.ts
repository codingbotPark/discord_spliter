import { application, RequestHandler} from "express"
import Handler from "../Handler"
import { HTTPMethod } from "../../util/httpMethod.ts"
import {  InteractionResponseType, InteractionType } from "discord-interactions";
import test from "./test/test.ts";
import gameAPI, { RegisteredGames } from "../../gameAPI/index.ts";
import { gameCommandOption } from "../../command/GameCommandCollector.ts";
import { ResponseStrategyActionType } from "../../model/gameAPI/InteractionResponseExec.ts";
import { parseCustomID } from "../../util/customID.ts";
import optionsToObject from "../../util/choicesToObj.ts";


const applicationCommands:Record<string, RequestHandler> = {
    "test":test,
    ...Object.entries(gameAPI).reduce((gameAPIObj:Record<RegisteredGames, RequestHandler>, [key, api]) => {
        gameAPIObj[key] = api.executeAction.bind(api)
        return gameAPIObj
    }, {})
}
function isCommand(commandName:any):commandName is keyof typeof applicationCommands{
    return commandName in applicationCommands
}


const messageComponents:Record<string, RequestHandler> = {
    ...Object.entries(gameAPI).reduce((gameAPIObj:Record<string,RequestHandler>, [key, api]) => {
        gameAPIObj[key] = api.executeAction.bind(api)
        return gameAPIObj
    }, {})
}
function isMessageComponentHandler(messageName:string):messageName is keyof typeof messageComponents{
    return messageName in messageComponents;
}

// classifiy with discord interaction type
const interactionClassifier:RequestHandler =  (req , res, next) => {
    
    // interaction type
    const { type, data} = req.body;
    
    if (type === InteractionType.PING){ // ping pong for regist discordAPP
        return res.send({ type: InteractionResponseType.PONG });

    } else if (type === InteractionType.APPLICATION_COMMAND){ // slash
        const commandName = data.name
        if(!isCommand(commandName)){throw Error("unknown command")}

        const options = data.options
        const optionsInformation:gameCommandOption | null = optionsToObject(options)
        
        // 함께 들어온 options이 있을 때만 부여
        console.log(req.body)
        if(optionsInformation && optionsInformation['using']){
            req.body.action = {strategyName:optionsInformation['using'], action:ResponseStrategyActionType.Command}
        }
        
        applicationCommands[commandName](req,res,next)

    } else if (type === InteractionType.MESSAGE_COMPONENT){
        const customID = data.custom_id

        const [messageName] = parseCustomID(customID)
        if(!isMessageComponentHandler(messageName)){throw Error("unknown message component")}

        const [action] = parseCustomID(customID, 1)

        /**@TODO edit using componentID */
        req.body.action = {strategyName:action, action:ResponseStrategyActionType.Message}

        messageComponents[messageName](req,res,next)
    }
}

const interactionHandler: Handler = {}
interactionHandler[HTTPMethod.POST] = interactionClassifier

export default interactionHandler

