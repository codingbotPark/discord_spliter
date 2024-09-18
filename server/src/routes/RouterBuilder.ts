import { RequestHandler, Router } from "express";
import { HTTPMethod, isHTTPMethod } from "../util/httpMethod";

class RouterBuilder{
    private subPath:string = ""
    private method:HTTPMethod | undefined;
    private handlers:RequestHandler[] = []

    clear(){
        this.subPath = ""
        this.method = undefined
        this.handlers = []
    }

    setSubPath(subPath:string):this{
        this.subPath = subPath
        return this
    }

    setMethod(method:HTTPMethod):this{
        this.method = method
        return this
    }

    addHandler(handler:RequestHandler):this{
        this.handlers.push(handler)
        return this
    }

    build(){
        if(!this.handlers.length){
            // need at least 1 length
        }
        if(!isHTTPMethod(this.method)){
            // have to define method
            return
        }

        const router = Router({strict:true})[this.method](this.subPath).use(this.handlers)
        this.clear()
        return router
    }

}

/** @TODO make http method to enum */

export default RouterBuilder