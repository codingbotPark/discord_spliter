import 'dotenv/config';
import { verifyKeyMiddleware } from "discord-interactions";
import RouterHub from './RouterHub';
import RouterBuilder from './RouterBuilder';
import { HTTPMethod } from '../util/httpMethod';

class InteractionRouterHub extends RouterHub {
    constructor() {
        super('/interactions')
    }

    setRouters(): void {
        const routerBuilder = new RouterBuilder()
        this.addRouter(routerBuilder.setMethod(HTTPMethod.POST).)
    }
}

export default InteractionRouterHub