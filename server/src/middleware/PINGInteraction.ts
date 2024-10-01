import {  InteractionResponseType, InteractionType } from "discord-interactions";
import { RequestHandler } from "express";


const PINGInteraction:RequestHandler = (req, res, next) => {

    if (req.body?.type === InteractionType.PING){
        return res.send({ type: InteractionResponseType.PONG });
    } else{
        next()
    }

}

export default PINGInteraction