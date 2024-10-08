import { Router } from "express";
import Collector from "../employee/Collector.ts";
import RouterBuilder from "./RouterBuilder";
import { HTTPMethod } from "../util/httpMethod.ts";
import { confirmHandler } from "../handlers/Handler.ts";
import redirectionHandler from "../handlers/redirection/index.ts";


// for Oauth2
class RedirectionRouterCollector extends Collector<Router, RouterBuilder>{
    collect(): void {
        this.addItemToCollection(
            this.equipment
            .set("method",HTTPMethod.GET)
            .addHandler(confirmHandler(redirectionHandler.get))
            .build()
        )
    }
}

export default RedirectionRouterCollector