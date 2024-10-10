import GameAPI from "./GameAPI.ts"
import LeagueOfLegendsGameAPI from "./games/leagueOfLegends.ts"
import OverwatchGameAPI from "./games/overwatch.ts"
import ValorantGameAPI from "./games/valorant.ts"

/** @todo don't know What's better instance or class */
const gameAPI:Record<string, GameAPI> = {
    "lol":new LeagueOfLegendsGameAPI(),
    "valorant":new ValorantGameAPI(),
    'overwatch':new OverwatchGameAPI()
}

export default gameAPI

export type RegisteredGames = keyof typeof gameAPI

export function isRegisteredGame(game:string):game is RegisteredGames{
    return Object.keys(gameAPI).includes(game)
}