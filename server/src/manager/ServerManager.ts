import { Server } from "http";
import { Express } from "express";
import Manager from "../employee/Manager.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import { Client, Collection, GuildMember } from "discord.js";
import client from "../util/discordUtil/client.ts";
import TokenRedis from "../util/TokenRedis.ts";

// ServerManager class role = turn on & off express server
class ServerManager extends Manager {

    server:Server | undefined;
    
    constructor(){super()}

    manage(app: Express): void {
        this.openServer(app)
    }

    fired(): void {
        this.closeServer()
    }

    openServer(app:Express){
        const port = verifiedEnv.PORT
        this.server = app.listen(port, () => {
            // logging for opening server
            console.log("listening port " + port)
        })
        this.loginDiscordJS()
    }

    closeServer(){
        this.server?.close(() => {
            // logging for closeing server
        })

        
    }

    loginDiscordJS(){
        client.login(verifiedEnv.DISCORD_TOKEN)
    }
    


}

export default ServerManager