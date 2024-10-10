import express, { Express, Router } from "express";
import Manager from "../employee/Manager.ts";
import { RouterCollector } from "../router/index.ts";
import cors from 'cors'
import session from "express-session";
import { verifiedEnv } from "../util/verifyEnv.ts";

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
        app.use(session({ // setting session for saving token
            secret: verifiedEnv.SESSION_KEY, 
            resave: false,           // not save for no changing
            saveUninitialized: true, 
            cookie: { secure: false } // set true if using https
        }));
    }

    confirmRouters(app:Express){
        this.routerCollectors.forEach((routerCollector) => routerCollector.collect())
        this.routerCollectors.forEach((routerCollector) => routerCollector.getCollection().forEach((router) => {
            app.use(router)
        }))
    }

}

export default RouterManager