import { Client } from "discord.js";
import Curator from "../employee/Curator.ts";
import Archive from "./Archive.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";




export class DiscordArchive extends Archive{}

class DiscordCurator extends Curator{
    constructor(){
        super(DiscordArchive.getInstance())
    }

    setupArchive():this{
        this.addArchivePlan("client", this.connectDiscordJS())
        return this
    }

    async connectDiscordJS(){
        // setup & login discord.js client
        const client = new Client({
            intents: [
                'Guilds',
                'GuildMembers',
                'GuildPresences'
            ]
        })
        client.login(verifiedEnv.DISCORD_TOKEN)
        DiscordCurator.addToArchive("client",client)
        return client
    }
}

export default DiscordCurator