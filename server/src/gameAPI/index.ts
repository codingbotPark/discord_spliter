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



export const rankScore = {
    'Unknown':0,
    'Bronze':1,
    'Silver':2,
    'Gold':4,
    'Platinum':6,
    'Diamond':9,
    'Master':11,
    'Grandmaster':14
} as const

export type RankKey = keyof typeof rankScore;
