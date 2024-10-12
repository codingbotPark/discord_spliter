import { Request, Response } from "express";
import GameAPI from "../GameAPI";
import { makeAuthAllowComponent } from "../../handlers/interactions/components/OAuth.ts";


class OverwatchGameAPI implements GameAPI{
    splitWithTier(req: Request, res: Response): boolean {
        console.log(req.body.member.user)

        res.send(makeAuthAllowComponent({content:`need allow to access your profile`}))


        

        return true
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