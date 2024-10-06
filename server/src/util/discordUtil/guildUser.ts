import {  GuildMember } from "discord.js";
import { ChoicesType } from "../../command/CommandOption/CommandOption";
import client from "./client.ts";


export async function getGuildUser(guildID:string){
    const guild = await client.guilds.fetch(guildID);
    const guildMemberCollection = await guild.members.fetch();

    // set guildMembers to choicesType
    const guildMemberChoices:ChoicesType = guildMemberCollection.filter((discordUser) => isDiscordHumanMember(discordUser)).map((discordUser) => (
        {   
            name:discordUser.user.username,
            value:discordUser.user.id
        }
    ))
}


export function isDiscordHumanMember(discordUser: GuildMember): discordUser is GuildMember & { user: NonNullable<GuildMember> } {
    return !!(discordUser.user && !discordUser.user.bot);
}