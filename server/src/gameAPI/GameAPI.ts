
// index 0 = channel 1 ...

import { Collection, GuildMember } from "discord.js"

// string = discord user id
export type SplitedMemberType = Array<string[]>

abstract class GameAPI{
    abstract getSplitedMember(discordMembers:Collection<string, GuildMember>):SplitedMemberType
}

export default GameAPI