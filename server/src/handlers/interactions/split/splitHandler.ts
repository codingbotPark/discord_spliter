import { Request, RequestHandler, Response } from "express";
import { ChoicesType, ChoiceType } from "../../../command/Command/CommandOption/CommandOption.ts";
import { SplitMethod } from "../../../command/SplitCommandCollector.ts";
import { RegisteredGames } from "../../../gameAPI/index.ts";
import { makeNeedInfoComponent } from "../components/split.ts";
import { makeAuthAllowComponent } from "../components/OAuth.ts";
import { APIConnection, ConnectionService } from "discord.js";
import optionsToObject from "../../../util/discordUtil/choicesToObj.ts";

// return type in excuting against command
export interface SplitInfoType {
    excludeUser?: Array<string>;
    method?: SplitMethod,
    channel_number?: number,
    game?: RegisteredGames,
}

interface CompletedSplitInfoType extends SplitInfoType {
    method:SplitMethod,
    game:RegisteredGames,
}
function areOptionsCompleted(splitInfo:SplitInfoType):splitInfo is CompletedSplitInfoType{
    return !!(splitInfo.method && splitInfo.game)
}
function fillOptions(splitInfo:SplitInfoType):SplitInfoType{
    /**@TODO working to find options */ 

    return splitInfo;
}


const splitHandler:RequestHandler = async(req, res) => {
    const {guild_id, data, member} = req.body
    const {user} = member
    
    const options:ChoicesType = data.options ?? []
    const splitInformation:SplitInfoType = optionsToObject(options)
    const confirmedSplitInfo = fillOptions(splitInformation)

    if (!areOptionsCompleted(confirmedSplitInfo)){ // return component to fill info
        return res.send(makeNeedInfoComponent(confirmedSplitInfo))
    }

    // get accessToken to get connection
    const accessToken = req.query.token as string
    if (!accessToken) {
        return res.send(makeAuthAllowComponent({content:`need allow to access your profile`}))
    }
    
    const appConnections = getUserConnections(accessToken)
    
    // get splited member

 
}

export default splitHandler


async function getUserConnections(accessToken:string):Promise<APIConnection[]>{
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
    return connections as APIConnection[]
}



