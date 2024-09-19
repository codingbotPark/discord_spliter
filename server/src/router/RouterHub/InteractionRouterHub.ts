import 'dotenv/config';
import { verifyKeyMiddleware } from '../../../node_modules/discord-interactions/dist/index';
import RouterHub from './RouterHub';
import RouterBuilder from '../RouterBuilder';
import { HTTPMethod } from '../../util/httpMethod';

class InteractionRouterHub extends RouterHub {
    constructor() {
        super('/interactions')
    }

    setRouters(): void {
        const routerBuilder = new RouterBuilder()
        this.addRouter(
            routerBuilder
            .setMethod(HTTPMethod.POST)
            .addHandler(verifyKeyMiddleware(process.env.PUBLIC_KEY as string))
            .addHandler(() => console.log("test")).build()
        )
    }
}

export default InteractionRouterHub