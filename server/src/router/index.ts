import { Router } from "express"
import Collector from "../employee/Collector.ts"
import InteractionRouterCollector from "./InteractionRouterCollector.ts"
import RouterBuilder from "./RouterBuilder.ts"
import RedirectionRouterCollector from "./RedirectionRouterCollector.ts"

export type RouterCollector = Collector<Router, RouterBuilder>

const routerCollections:RouterCollector[] = [
    new InteractionRouterCollector(new RouterBuilder("interactions")),
    new RedirectionRouterCollector(new RouterBuilder("redirection"))
]

export default routerCollections