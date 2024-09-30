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
        this.addArchivePlan("members", this.getGuildMembers())
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

    async getGuildMembers(){
        const client = DiscordCurator.getFromArchive<Client>("client")

        if (!client) throw Error("there are no client")

        client.once("ready", () => {
            if (!client.user) {throw Error("not ready")}
        })

        const membersArray = await Promise.all(
            client.guilds.cache.map(guild => guild.members.fetch())
        ).catch((err) => {throw Error("fail to fetch guild memebrs")})

        membersArray.forEach(members => {
            members.forEach(member => {
                if (member.presence) {
                    console.log(`${member.user.tag} is ${member.presence.status}`);
                    
                    // 활동 중일 경우 활동 내용도 출력
                    if (member.presence.activities.length > 0) {
                        member.presence.activities.forEach(activity => {
                            console.log(`Activity: ${activity.name}`);
                        });
                    }
                }
            });
        });

        return membersArray
    }
}

export default DiscordCurator