import RouterHub from "./router/RouterHub/RouterHub.ts";
import { Express, Router } from "express";

// RouterManager class role = set Routers to app
class RouterManager{

    routerHubs:RouterHub[]
    
    constructor(routerHubs:RouterHub[]){
        this.routerHubs = routerHubs
    }

    confirmRoutes(app:Express){
        this.routerHubs.forEach((routerHub:RouterHub) => {
            routerHub.getRouters().forEach((router:Router) => {
                app.use(routerHub.basePath, router)
            })
        })
    }

}

export default RouterManager