import { Handler, Router as ExpressRouter, RequestHandler, IRouterMatcher } from "express";


// router class role = routing to service or middleware
// router is-a [something]Router => abstract class
abstract class Router{
    basePath:string
    expressRouter:ExpressRouter
    constructor(basePath:string){
        this.basePath = basePath
        this.expressRouter = ExpressRouter({strict:true}) // return express core.router
    }

    protected registRoute(method:HTTPMethod, subPath:string, ...handlers:RequestHandler[]){
        this.expressRouter[method](subPath, handlers)
    }

    // regist route
    abstract initializeRoutes():void

    getRouter():ExpressRouter{
        return this.expressRouter
    }

}


type HTTPMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head"

export default Router