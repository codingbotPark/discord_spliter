import Router from "./Router";
import { Express } from "express";

// RouterManager class role = 
class RouterManager{
    routers:Router[]
    constructor(routers:Router[]){
        this.routers = routers
    }
    registRoutes(app:Express){
        this.routers.forEach((router:Router) => {
            router.setRoutes()
            app.use(router.basePath, router.getRouter())
        })
    }
}

export default RouterManager