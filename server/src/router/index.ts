import { Router } from "express"
import Collector from "../employee/Collector.ts"
import InteractionRouterCollector from "./InteractionRouterCollector.ts"
import RouterBuilder from "./RouterBuilder.ts"

export type RouterCollector = Collector<Router, RouterBuilder>

const routerHubs:RouterCollector[] = [
    new InteractionRouterCollector(new RouterBuilder("interactions")),
]

export default routerHubs