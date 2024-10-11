import { Request, Response } from "express";
import { verifiedEnv } from "../../util/verifyEnv.ts";
import GameAPI from "../GameAPI.ts";

class LeagueOfLegendsGameAPI implements GameAPI{


    splitWithMatch(req: Request, res: Response): Response {
        return res
    }

    getMembersWithMatch(){
        // const [gameName, tagLine] = me.payload.split("#")
        const [gameName, tagLine] = ["박모씨","#12345"]
        const region = "kr"
        const url = `https://${region}.api.riotgames.com//riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${verifiedEnv.RIOT_API_KEY}`
        return true
    }

}

export default LeagueOfLegendsGameAPI