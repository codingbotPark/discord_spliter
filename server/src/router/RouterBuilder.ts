
import express, {RequestHandler, Router} from "express";
import Builder from "../employee/Builder.ts";
import { HTTPMethod, isHTTPMethod } from "../util/httpMethod.ts";
import normalizePath from "../util/normalizePath.ts";

interface RouterTemplate{ method: HTTPMethod; subPath:string; handlers:Array<RequestHandler> }

class RouterBuilder extends Builder<RouterTemplate, Router>{
    private basePath:string

    constructor(basePath:string = ""){
        super()
        this.building.handlers = [] // handlers 초기화
        this.building.subPath = "" // subPath 초기화
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
        console.log(this.building)
        if(!this.isRouter(this.building)){
             /** @TODO add err handler */
            throw Error()
        }
        const path = normalizePath(this.basePath, this.building.subPath)
        // return Router()[this.building.method](path, ...this.building.handlers)
        // return Router()[this.building.method](path).use(this.building.handlers)
        // 라우트를 정의하고 핸들러를 추가
        const route = Router()[this.building.method](path);
        route.use(...this.building.handlers);

        return route
    }

    addHandler(handler:RequestHandler):this{
        this.building.handlers?.push(handler)
        return this
    }

}

export default RouterBuilder