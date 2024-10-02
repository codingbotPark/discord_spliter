

export const gameAPI = {
    "league of legends":() => {},
    "Valorant":() => {},
}

export type RegisteredGames = keyof typeof gameAPI

export function isRegisteredGame(game:string):game is RegisteredGames{
    return Object.keys(gameAPI).includes(game)
}