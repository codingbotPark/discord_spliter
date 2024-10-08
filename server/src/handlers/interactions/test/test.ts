import { InteractionResponseType } from "discord.js";
import { RequestHandler } from "express";


const test:RequestHandler = (req,res) => {
    res.send({
        type:InteractionResponseType.ChannelMessageWithSource,
        data:{
            content:`hi, ${req.body.member.user.username}`
        }
    })
}

export default test