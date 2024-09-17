import { RequestHandler } from "express";

class RouteBuilder{
    private subPath:string = ""
    private method:HTTPMethod | undefined;
    private handlers:RequestHandler[] | [] = []

    setSubPath(subPath:string):this{
        this.subPath = subPath
        return this
    }

    setMethod(method:HTTPMethod):this{
        this.method = method
        return this
    }

    addHandler(handler:RequestHandler):this{
        this.handlers?.push()
        return this
    }

    build(){
        if(!this.handlers.length){
            // need at least 1 length
        }
        if(!this.method){
            // have to define method
        }
        
    }

}

/** @TODO make http method to enum */
type HTTPMethod = "all" | "get" | "post" | "put" | "delete" | "patch" | "options" | "head"

export default RouteBuilder