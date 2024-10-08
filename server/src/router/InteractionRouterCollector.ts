import { Request, Response, Router } from "express";
import Collector from "../employee/Collector.ts";
import RouterBuilder from "./RouterBuilder.ts";
import { HTTPMethod } from "../util/httpMethod.ts";
import { verifyKeyMiddleware } from "discord-interactions";
import { verifiedEnv } from "../util/verifyEnv.ts";
import { confirmHandler } from "../handlers/Handler.ts";
import interactionHandler from "../handlers/interactions/index.ts";


class InteractionRouterCollector extends Collector<Router, RouterBuilder>{

    
    collect(): this {
        this.addItemToCollection(
            this.equipment
            .set("method",HTTPMethod.POST)
            .addHandler(verifyKeyMiddleware(verifiedEnv.PUBLIC_KEY))
            .addHandler(confirmHandler(interactionHandler.post))
            .build()
        )

        return this
    }
     
}

export default InteractionRouterCollector