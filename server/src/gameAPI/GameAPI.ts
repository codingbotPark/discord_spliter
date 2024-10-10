
// index 0 = channel 1 ...

import { Collection, GuildMember } from "discord.js"

// string = discord user id
export type SplitedMemberType = Array<string[]>

interface GameAPI{
    // if the game provide match history with players
    getMembersWithMatch?(discordMembers:Collection<string, GuildMember>):SplitedMemberType;
    // if the game provide tier with user ID
    splitWithTier?():SplitedMemberType;
}

export default GameAPI

// map for using in user command
export const apiNameMap:Record<string, string> = {
    "getMembersWithMatch":"matched member",
    "splitWithTier":"tier, proficiency"
}

