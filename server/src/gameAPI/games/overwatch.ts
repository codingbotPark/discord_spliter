import { Request, Response } from "express";
import GameAPI from "../GameAPI";
import { makeAuthAllowComponent } from "../../handlers/interactions/components/OAuth.ts";
import TokenRedis from "../../util/TokenRedis.ts";


class OverwatchGameAPI implements GameAPI{
    async splitWithTier(req: Request, res: Response) {
        console.log(req.body.member.user)

        const accessToken = await TokenRedis.getInstance().fetchToken(req.body.member.user.id)

        if (!accessToken){
            res.send(makeAuthAllowComponent({content:`need allow to access your profile`}))
        }


        
    }
}

export default OverwatchGameAPI

// connection ex
// [
//     {
//       "id": "1234567890",
//       "name": "YourBattleNetUsername#1234",
//       "type": "battlenet",
//       "verified": true,
//       "friend_sync": false,
//       "show_activity": true,
//       "visibility": 1
//     },
//     ...
//   ]