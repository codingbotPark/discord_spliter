import { Router } from "express";


// RouterHub class role = set Routers with middleware & provide routers to routerManager
// RouterHub is-a [something]RouterHub => abstract class
abstract class RouterHub{
    protected routers:Router[] = []
    protected basePath:string;

    constructor(basePath:string = ""){
        this.basePath = basePath
    }

    // set Routes using addRouter method
    abstract setRouters():this

    getBasePath():string{
        return this.basePath
    } 

    getRouters():Router[]{
        return this.routers
    }
    
    protected addRouter(router:Router){
        this.routers.push(router)
    }

}


export default RouterHub