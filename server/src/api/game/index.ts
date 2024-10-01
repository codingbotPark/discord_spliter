

export const gameAPI = {
    "Overwatch":() => {},
    "league of legends":() => {}
}

export type RegisteredGames = keyof typeof gameAPI

export function isRegisteredGame(game:string):game is RegisteredGames{
    return Object.keys(gameAPI).includes(game)
}