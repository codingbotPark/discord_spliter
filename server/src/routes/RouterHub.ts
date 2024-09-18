import { Router } from "express";


// router class role = routing to service or middleware
// router is-a [something]Router => abstract class

abstract class RouterHub{
    routers:Router[] = []

    constructor(){}

    // set Routes using addRouter method
    abstract setRouters():void

    protected getRouters(){
        return this.routers
    }
    
    protected addRouter(router:Router){
        this.routers.push(router)
    }

}


export default RouterHub