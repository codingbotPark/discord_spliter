import GameAPI from "./GameAPI.ts"
import LeagueOfLegendsGameAPI from "./games/leagueOfLegends.ts"
import overwatchSplitAPI from "./overwatch/overwatch.ts"
import OverwatchGameAPI from "./overwatch/overwatch.ts"
import ValorantGameAPI from "./games/valorant.ts"

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