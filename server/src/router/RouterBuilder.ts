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

    build():Router{
        if(!this.handlers.length){
            // need at least 1 length
            return Router()
        }
        if(!isHTTPMethod(this.method)){
            // have to define method
            return Router()
        }

        const router = Router({strict:true})[this.method](this.subPath).use(this.handlers)
        this.clear()
        return router
    }

    /** @TODO add err handler */

}

export default RouterBuilder