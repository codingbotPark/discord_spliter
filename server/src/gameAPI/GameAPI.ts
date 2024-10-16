
// index 0 = channel 1 ...

import { Collection, GuildMember } from "discord.js"
import { Request, RequestHandler, Response } from "express";

// string = discord user id

interface GameAPI{
    // if the game provide match history with players
    splitWithMatch?(req:Request, res:Response):boolean;
    // if the game provide tier with user ID
    splitWithTier?(req:Request, res:Response):boolean;
}


export default GameAPI

// map for using in user command
export const apiNameMap:Record<string, string> = {
    "splitWithMatch":"matched member",
    "splitWithTier":"tier, proficiency"
}
