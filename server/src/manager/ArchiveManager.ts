import { Express } from "express";
import Manager from "../employee/Manager.ts";
import Curator from "../employee/Curator.ts";
import DiscordCurator from "../archive/DiscordCurator.ts";
import { Client } from "discord.js";
import { verifiedEnv } from "../util/verifyEnv.ts";

class ArchiveManager extends Manager{
    curators:Curator[]

    constructor(curators:Curator[]){
        super()
        this.curators = curators
    }

    manage(app: Express | undefined): void {
        // const client = DiscordCurator.getFromArchive<Client>("client")
        // client?.once('ready', async () => {
        //     console.log(`Logged in as ${client.user?.tag}`);

        //     // 특정 서버의 멤버 정보 가져오기
        //     const guild = client.guilds.cache.get(verifiedEnv.GUILD_ID);
        //     if (!guild) {
        //         console.log("Guild not found");
        //         return;
        //     }

        //     client.guilds.cache.forEach(guild => {
        //         console.log(`Guild ID: ${guild.id}, Guild Name: ${guild.name}`);
        //     });

        //     // 서버의 모든 멤버 정보와 상태를 가져오기
        //     const members = await guild.members.fetch();
        //     members.forEach(member => {
        //         // Presence가 있는 멤버만 출력
        //         if (member.presence) {
        //             console.log(`${member.user.tag} is ${member.presence.status}`);

        //             // 멤버가 현재 활동 중인 경우 활동 정보도 출력
        //             if (member.presence.activities.length > 0) {
        //                 member.presence.activities.forEach(activity => {
        //                     console.log(`Activity: ${activity.name} - ${activity.type}`);
        //                 });
        //             }
        //         }
        //     });
        // });
    }

    keepUserActivity(){
        
    }

}

export default ArchiveManager