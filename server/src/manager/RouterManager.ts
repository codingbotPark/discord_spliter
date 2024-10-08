import express, { Express, Router } from "express";
import Manager from "../employee/Manager.ts";
import { RouterCollector } from "../router/index.ts";
import cors from 'cors'

// RouterManager class role = set Routers to app
class RouterManager extends Manager{

    private routerCollectors:RouterCollector[]
    
    constructor(routerCollectors:RouterCollector[]){
        super();
        this.routerCollectors = routerCollectors
    }

    manage(app:Express): void {
        this.confirmRouters(app)
    }

    setMiddleWares(app:Express){
        app.use(express.json())
        // app.use(cors({
        //     origin: '*', // 필요한 경우 특정 도메인으로 제한할 수 있습니다.
        //     credentials: true,
        // }));
    }

    confirmRouters(app:Express){
        this.routerCollectors.forEach((routerCollector) => routerCollector.collect())
        this.routerCollectors.forEach((routerCollector) => routerCollector.getCollection().forEach((router) => {
            app.use(router)
        }))
    }

}

export default RouterManager