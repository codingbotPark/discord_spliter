import { Request, Response, Router } from "express";
import Collector from "../employee/Collector";
import RouterBuilder from "./RouterBuilder";
import { HTTPMethod } from "../util/httpMethod";


class InteractionRouterCollector extends Collector<Router, RouterBuilder>{

    collect(): this {
        const routerBuilder = new RouterBuilder()
        this.addItemToCollection(
            routerBuilder
            .set("method",HTTPMethod.POST)
            .addHandler((req: Request, res: Response) => {
                console.log("test")
            })
            .build()
        )

        return this
    }
     
}

export default InteractionRouterCollector