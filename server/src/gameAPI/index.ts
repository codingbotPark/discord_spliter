import GameAPI from "./GameAPI.ts"
import LeagueOfLegendsGameAPI from "./games/leagueOfLegends.ts"
import ValorantGameAPI from "./games/valorant.ts"


export const gameAPI:Record<string,new () => GameAPI> = {
    "league of legends":LeagueOfLegendsGameAPI,
    "Valorant":ValorantGameAPI,
}

export type RegisteredGames = keyof typeof gameAPI

export function isRegisteredGame(game:string):game is RegisteredGames{
    return Object.keys(gameAPI).includes(game)
}