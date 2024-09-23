import RouterHub from "../router/RouterHub/RouterHub.ts"; 
import { Express, Router } from "express";
import Manager from "../employee/Manager.ts";

// RouterManager class role = set Routers to app
class RouterManager extends Manager{

    private routerHubs:RouterHub[]
    
    constructor(routerHubs:RouterHub[]){
        super();
        this.routerHubs = routerHubs
    }

    manage(app:Express): void {
        this.confirmRouters(app)
    }

    confirmRouters(app:Express){
        this.routerHubs.forEach((routerHub:RouterHub) => {
            routerHub.setRouters().getRouters().forEach((router:Router) => {

                // // Iterate through each route in the router
                // router.stack.forEach((layer: any) => {
                //     if (layer.route) { // If this is a route and not middleware
                //         const methods = Object.keys(layer.route.methods).join(', ').toUpperCase(); // HTTP methods
                //         console.log(`Method: [${methods}], Path: ${routerHub.getBasePath() + layer.route.path}`);
                //     }
                // });

                app.use(routerHub.getBasePath(), router)
            })
        })
    }

}

export default RouterManager