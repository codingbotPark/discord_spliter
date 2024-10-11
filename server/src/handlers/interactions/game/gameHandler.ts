import { RequestHandler } from "express";
import gameAPI, { RegisteredGames } from "../../../gameAPI/index.ts";
import { ChoicesType } from "../../../command/Command/CommandOption/CommandOption.ts";
import optionsToObject from "../../../util/discordUtil/choicesToObj.ts";
import { gameCommandOption } from "../../../command/gameCommandCollector.ts";


const gameHandler:RequestHandler = async(req, res) => {
    // option ex [ { name: 'using', type: 3, value: 'splitWithTier' } ]
    const {name, options}:{name:RegisteredGames, options:ChoicesType} = req.body.data
    const commandName = name

    const api = gameAPI[commandName]
    const optionInformation:gameCommandOption = optionsToObject(options)

    console.log("imhere1",optionInformation)
    if (optionInformation['using'] === undefined){
        // if there are no using, check activity & confirm using
        // if there are no activity, request ti fill
        return res
    }
    const apiResponse = api[optionInformation['using']]?.(req,res)
    console.log("imhere2", apiResponse)

    if (!apiResponse){
        
    }

    return apiResponse
         // using api
        
    // api request is static because registed commands are exist

    
}

export default gameHandler