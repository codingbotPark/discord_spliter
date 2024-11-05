
// index 0 = channel 1 ...

import { Request, Response } from "express";

// string = discord user id

interface GameAPI{
    // if the game provide match history with players
    splitWithMatch?(req:Request, res:Response):void;
    // if the game provide tier with user ID
    splitWithTier?(req:Request, res:Response):void;

    eventHandler?(req:Request, res:Response):void
}


export default GameAPI

// map for using in user command
export const apiNameMap:Record<string, string> = {
    "splitWithMatch":"matched member",
    "splitWithTier":"tier, proficiency"
}
