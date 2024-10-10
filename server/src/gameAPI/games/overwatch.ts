import GameAPI, { SplitedMemberType } from "../GameAPI";


class OverwatchGameAPI implements GameAPI{
    splitWithTier(): SplitedMemberType {
        return []
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