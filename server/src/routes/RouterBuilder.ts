import { RequestHandler, Router } from "express";
import { HTTPMethod, isHTTPMethod } from "../util/isHttpMethod";

class RouterBuilder{
    private subPath:string = ""
    private method:HTTPMethod | undefined;
    private handlers:RequestHandler[] = []

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

        return Router({strict:true})[this.method](this.subPath).use(this.handlers)
    }

}

/** @TODO make http method to enum */

export default RouterBuilder