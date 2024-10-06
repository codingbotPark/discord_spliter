import { RequestHandler} from "express"
import Handler from "../\bHandler"
import { HTTPMethod } from "../../util/httpMethod"
import {  InteractionResponseType, InteractionType } from "discord-interactions";
import { commandSpecification } from "../../manager/CommandManager";


const slashExecutions:Record<typeof commandSpecification[number], RequestHandler> = {
    "test":() => {},
    "split":() => {}
}

const interactionClassifier:RequestHandler =  (req , res) => {

    // interaction type
    const { type, data } = req.body;
    
    if (type === InteractionType.PING){ // ping pong for regist discordAPP
        return res.send({ type: InteractionResponseType.PONG });

    } else if (type === InteractionType.APPLICATION_COMMAND){ // slash
        const commandName = data.name


    } else if (type === InteractionType.MESSAGE_COMPONENT){
        const componentId = data.custom_id

    }
}

const interactionHandler: Handler = {}
interactionHandler[HTTPMethod.POST] = interactionClassifier

export default interactionHandler


