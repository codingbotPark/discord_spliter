import { Client, GuildMember } from "discord.js"

const client = new Client({
    intents: [
        'Guilds',
        'GuildMembers',
        'GuildPresences'
    ]
})

export default client


