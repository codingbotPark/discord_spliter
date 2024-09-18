import { Router } from "express";


// RouterHub class role = set Routers with middleware & provide routers to routerManager
// RouterHub is-a [something]RouterHub => abstract class
abstract class RouterHub{
    routers:Router[] = []
    basePath:string;

    constructor(basePath:string = ""){
        this.basePath = basePath
    }

    // set Routes using addRouter method
    protected abstract setRouters():void

    getRouters(){
        return this.routers
    }
    
    protected addRouter(router:Router){
        this.routers.push(router)
    }

}


export default RouterHub