import { RequestHandler } from "express";
import { ChoicesType, ChoiceType } from "../../../command/Command/CommandOption/CommandOption";
import { SplitMethod } from "../../../command/SplitCommandCollector";
import { RegisteredGames } from "../../../gameAPI";
import { makeNeedInfoComponent } from "./components.ts";
import DiscordRequest from "../../../util/discordRequest.ts";
import { HTTPMethod } from "../../../util/httpMethod.ts";
import { verifiedEnv } from "../../../util/verifyEnv.ts";

// return type in excuting against command
export interface SplitInfoType {
    excludeUser?: Array<string>;
    method?: SplitMethod,
    channel_number?: number,
    game?: RegisteredGames,
}
function choicesToSplitInfo(choices:ChoicesType):SplitInfoType{
    return choices.reduce((obj: { [key: string]: string | number }, option: ChoiceType) => {
        obj[option.name] = option.value
        return obj
    }, {})
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


const split:RequestHandler = async(req, res) => {
    const {guild_id, data, member} = req.body
    const {user} = member
    
    const options = data.options as ChoicesType ?? []
    const splitInformation: SplitInfoType = choicesToSplitInfo(options)
    const confirmedSplitInfo = fillOptions(splitInformation)

    const clientId = verifiedEnv.CLIENT_ID;
    const redirectUri = encodeURIComponent(verifiedEnv.REDIRECT_URI);
    const scope = 'identify connections';
    const responseType = 'code';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;    
    
    
    // if (!areOptionsCompleted(confirmedSplitInfo)){ // return component to fill info
    //     return res.send(makeNeedInfoComponent(confirmedSplitInfo))
    // }

    // get accessToken to get connection
    console.log("imhere1")
    const accessToken = req.query.token
    console.log("imhere2", !accessToken)
    if (!accessToken) {return res.redirect(discordAuthUrl)}
    console.log("imhere4")

    // get splited member

 
}

export default split



