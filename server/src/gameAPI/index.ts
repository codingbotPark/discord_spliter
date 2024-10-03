import GameAPI from "./GameAPI"
import LeagueOfLegendsGameAPI from "./games/leagueOfLegends"
import ValorantGameAPI from "./games/valorant"


export const gameAPI:Record<string,new () => GameAPI> = {
    "league of legends":LeagueOfLegendsGameAPI,
    "Valorant":ValorantGameAPI,
}

export type RegisteredGames = keyof typeof gameAPI

export function isRegisteredGame(game:string):game is RegisteredGames{
    return Object.keys(gameAPI).includes(game)
}