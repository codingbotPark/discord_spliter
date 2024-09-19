import { Server } from "http";
import RouterManager from "./RouterManager.ts";
import { Express } from "express";

// ServerManager class role = turn on & off express server
class ServerManager {

    routerManager:RouterManager;
    server:Server | undefined;
    
    constructor(routerManager:RouterManager){
        this.routerManager = routerManager
    }

    private getPort({presetPort}:{presetPort:number}):number{
        const envPort = Number(process.env.PORT)
        if (isNaN(envPort)){
            return presetPort
        }
        return envPort
    }

    openServer(app:Express){
        const port = this.getPort({presetPort:3000})
        this.routerManager.confirmRoutes(app) // injection app to confirm routers
        this.server = app.listen(port, () => {
            // logging for opening server
        })

    }

    closeServer(){
        this.server?.close(() => {
            // logging for closeing server
        })
    }
}

export default ServerManager