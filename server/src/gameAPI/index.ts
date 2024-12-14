import GameAPI from "./GameAPI.ts"
import overwatchSplitAPI from "../handlers/interactions/games/overwatch/overwatch.ts"

/** @todo don't know What's better instance or class */
const gameAPI:Record<string, GameAPI> = {
    'overwatch':overwatchSplitAPI
}
export default gameAPI

export const gameNameShortCut:Record<string, string> = {
    "lol":"league of legends"
}

export type RegisteredGames = keyof typeof gameAPI

export function isRegisteredGame(game:string):game is RegisteredGames{
    return Object.keys(gameAPI).includes(game)
}
