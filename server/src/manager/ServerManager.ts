import { Server } from "http";
import { Express } from "express";
import Manager from "../employee/Manager.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
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
        this.connectRedis()
    }

    closeServer(){
        this.server?.close(() => {
            // logging for closeing server
        })
    }

    connectRedis(){
        TokenRedis.getInstance().connect().then(() => {
            console.log("connect redis")      
        })
    }

}

export default ServerManager