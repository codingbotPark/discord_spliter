import express, { Express, Router } from "express";
import Manager from "../employee/Manager.ts";
import { RouterCollector } from "../router/index.ts";

// RouterManager class role = set Routers to app
class RouterManager extends Manager{

    private routerCollectors:RouterCollector[]
    
    constructor(routerCollectors:RouterCollector[]){
        super();
        this.routerCollectors = routerCollectors
    }

    manage(app:Express): void {
        app.use(express.json())
        this.confirmRouters(app)
    }

    confirmRouters(app:Express){
        this.routerCollectors.forEach((routerCollector) => routerCollector.collect())
        this.routerCollectors.forEach((routerCollector) => routerCollector.getCollection().forEach((router) => {
            app.use(router)
        }))
    }

}

export default RouterManager