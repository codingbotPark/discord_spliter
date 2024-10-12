import express, { Express, Router } from "express";
import Manager from "../employee/Manager.ts";
import { RouterCollector } from "../router/index.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";

// RouterManager class role = set Routers to app
class RouterManager extends Manager{

    private routerCollectors:RouterCollector[]
    
    constructor(routerCollectors:RouterCollector[]){
        super();
        this.routerCollectors = routerCollectors
    }

    manage(app:Express): void {
        this.setMiddleWares(app)
        this.confirmRouters(app)
    }

    setMiddleWares(app:Express){
        app.use(express.json())
    }

    confirmRouters(app:Express){
        this.routerCollectors.forEach((routerCollector) => routerCollector.collect())
        this.routerCollectors.forEach((routerCollector) => routerCollector.getCollection().forEach((router) => {
            app.use(router)
        }))
    }

}

export default RouterManager