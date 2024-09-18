import Router from "./routes/RouterHub";
import { Express } from "express";

// RouterManager class role = assign routers to app
class RouterManager{
    routers:Router[]
    constructor(routers:Router[]){
        this.routers = routers
    }
    confirmRoutes(app:Express){
        this.routers.forEach((router:Router) => {
            router.setRoutes()
            app.use(router.basePath, router.getRouter())
        })
    }
}

export default RouterManager