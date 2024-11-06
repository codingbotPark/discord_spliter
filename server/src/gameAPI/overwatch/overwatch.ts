import GameAPI, { SplitStrategies } from "../GameAPI.ts";
import OverwatchAPI, { Profile } from "overwatch-api";
import SplitWithTier from "./SplitWithTier.ts";


class OverwatchSplitAPI extends GameAPI{}
const overwatchSplitAPI = new OverwatchSplitAPI()
overwatchSplitAPI.registerAction(SplitStrategies.SplitWithTier, new SplitWithTier)


export default overwatchSplitAPI



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