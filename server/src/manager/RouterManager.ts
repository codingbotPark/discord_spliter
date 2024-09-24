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

                // Iterate through each route in the router
                router.stack.forEach((layer: any) => {
                    if (layer.route) { // If this is a route and not middleware
                        const methods = Object.keys(layer.route.methods).join(', ').toUpperCase(); // HTTP methods
                        console.log(`Method: [${methods}], Path: ${layer.route.path}`);
                    }
                });

                app.use(router)
            })
        })
    }

}

export default RouterManager