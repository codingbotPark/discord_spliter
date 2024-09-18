import RouterHub from "./router/RouterHub/RouterHub";
import RouterHubs from "./router/RouterHub/RouterHub";
import { Express, Router } from "express";

// RouterManager class role = set Routers to app
class RouterManager{

    routerHubs:RouterHubs[]
    
    constructor(routerHubs:RouterHubs[]){
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