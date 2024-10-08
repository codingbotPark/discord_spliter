import { RequestHandler } from "express";
import { HTTPMethod } from "../../util/httpMethod.ts";
import Handler from "../Handler.ts";
import { verifiedEnv } from "../../util/verifyEnv.ts";
import { InteractionResponseType } from "discord.js";


const redirectionGetHandler:RequestHandler = async(req,res) => {
    // there is code after auth redirecting
    const code = req.query.code as string;
    if (!code) throw Error("there are no code")
            
    const params = new URLSearchParams()
    params.append('client_id', verifiedEnv.CLIENT_ID);
    params.append('client_secret', verifiedEnv.CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    // redirectUri should match with define in app setting
    params.append('redirect_uri', verifiedEnv.REDIRECT_URI);
    params.append('scope', 'identify connections')

    const response = await fetch('https://discord.com/api/oauth2/token', {
        method:HTTPMethod.POST,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body:params.toString()
    });

    if (!response.ok){
        throw Error(`fail to get token ${response.status}`)
    }

    const tokenData = await response.json()
    const accessToken = tokenData.access_token;

    if (!accessToken){ throw Error("there are no accessToken")}

    // session 에 저장


    return res.send({
        type:InteractionResponseType.ChannelMessageWithSource,
        data:{
            content:"hi"
        }
    })
}

const redirectionHandler: Handler = {}
redirectionHandler[HTTPMethod.GET] = redirectionGetHandler

export default redirectionHandler