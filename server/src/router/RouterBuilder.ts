
import express, {RequestHandler, Router} from "express";
import Builder from "../employee/Builder.ts";
import { HTTPMethod, isHTTPMethod } from "../util/httpMethod.ts";
import normalizePath from "../util/normalizePath.ts";

interface RouterTemplate{ method: HTTPMethod; subPath:string; handlers:Array<RequestHandler> }

class RouterBuilder extends Builder<RouterTemplate, Router>{
    private basePath:string

    constructor(basePath:string = ""){
        super()
        this.building.handlers = [] 
        this.building.subPath = "" 
        this.basePath = basePath
    }

    private isRouter(data:Partial<RouterTemplate>):data is RouterTemplate{
        return (
            (!!data.handlers?.length) &&
            isHTTPMethod(data.method) && 
            typeof data.subPath === 'string'
        );
    }

    build(): Router {
        if(!this.isRouter(this.building)){
             /** @TODO add err handler */
            throw Error()
        }
        const path = normalizePath(this.basePath, this.building.subPath)

        // define router & use handler
        const router = Router()[this.building.method](path,...this.building.handlers)
        return router
    }

    addHandler(handler:RequestHandler):this{
        this.building.handlers?.push(handler)
        return this
    }

}

export default RouterBuilder