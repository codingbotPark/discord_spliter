import { Handler, Router } from "express";


// router class role = routing to service or middleware
// router is-a [something]Router => abstract class
abstract class router{
    basePath:string
    router:Router
    constructor(basePath:string){
        this.basePath = basePath
        this.router = Router({strict:true}) // return express core.router
    }

    /** @todo fix handler type later */
    registRoute(method:HTTPMethod, subPath:string, handler:Handler){
        this.router[method](subPath, handler)
    }
}

type HTTPMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
