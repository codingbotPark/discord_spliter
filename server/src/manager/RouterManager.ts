import { Express, Router } from "express";
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
        this.confirmRouters(app)
    }

    confirmRouters(app:Express){
        this.routerCollectors.forEach((routerCollector:RouterCollector) => {
            routerCollector.collect().getCollection().forEach((router:Router) => {

                // router.stack.forEach((stack) => {
                //     app.use(stack.handle)
                // })

                app.use(router)

                
            })
        })
    }

}

export default RouterManager