import { RequestHandler } from "express";
import { HTTPMethod } from "../../util/httpMethod.ts";
import Handler from "../Handler.ts";
import { verifiedEnv } from "../../util/verifyEnv.ts";


const redirectionGetHandler:RequestHandler = async(req,res) => {
    const code = req.query.code as string;
    console.log("imhere3", code)
    if (!code) throw Error("there are no code")
            
    const params = new URLSearchParams()
    params.append('client_id', verifiedEnv.CLIENT_ID);
    params.append('client_secret', verifiedEnv.CLIENT_SECRET);
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
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

            // Fetch user connections using the access token
            const connectionsResponse = await fetch('https://discord.com/api/v10/users/@me/connections', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
    
            if (!connectionsResponse.ok) {
                throw new Error(`Fetching connections failed: ${connectionsResponse.status}`);
            }
    
            const connections = await connectionsResponse.json();
            console.log(connections); // Third-party connections data

    return res.redirect("/interactions")
    // const accessToken = response.data.access_token;
    // accessToken으로 Discord API 요청 가능
    
}

const redirectionHandler: Handler = {}
redirectionHandler[HTTPMethod.GET] = redirectionGetHandler

export default redirectionHandler