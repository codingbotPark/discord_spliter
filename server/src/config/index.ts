


import commandObjects from "./commandObjects.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import { installCommand } from "./installCommands.ts";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({
    intents: [GatewayIntentBits.GuildMembers, GatewayIntentBits.Guilds],
})

client.once(Events.ClientReady, async () => {
    console.log("\nready\n")
    const guild = await client.guilds.fetch(verifiedEnv.GUILD_ID)
    console.log("\nguild\n")
    if (!guild) return

    const guildMemebrs = await guild.members.fetch()
    guildMemebrs.forEach((memebr) => console.log(memebr.user.username))
})
client.login(verifiedEnv.DISCORD_TOKEN);

installCommand(verifiedEnv.APP_ID, commandObjects)

// const url = `https://discord.com/api/v10/guilds/${verifiedEnv.GUILD_ID}/members`;