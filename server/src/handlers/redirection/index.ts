import { RequestHandler } from "express";
import { HTTPMethod } from "../../util/httpMethod.ts";
import Handler from "../Handler.ts";
import { verifiedEnv } from "../../util/verifyEnv.ts";
import path, { dirname } from "path";
import { fileURLToPath } from 'url';
import { User } from "discord.js";
import TokenRedis from "../../util/TokenRedis.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    // access token 으로 유저 request 보내기
    const user = await getUser(accessToken)
    if (!user.id){throw Error("fail to get user")}
    console.log("userID",user.id)
    console.log("accessToken",accessToken)
    await TokenRedis.getInstance().storeToken(user.id, accessToken)

    
    // save session but EXPECTION = IT's NOT WORK => save session after request in redirectPage
    return res.sendFile(path.join(__dirname, 'redirectPage.html'));
}
const redirectionHandler: Handler = {}
redirectionHandler[HTTPMethod.GET] = redirectionGetHandler

export default redirectionHandler



async function getUser(accessToken:string):Promise<User>{
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
        method:HTTPMethod.GET,
        headers:{
            'Authorization': `Bearer ${accessToken}`,
        }
    })

    if (!userResponse.ok){
        throw new Error(`Fetching connections failed: ${userResponse.status}`);
    }

    const user = await userResponse.json()
    return user as User
}