import 'dotenv/config';
import { verifyKeyMiddleware } from "discord-interactions";
import RouterHub from './RouterHub';

class InteractionRouterHub extends RouterHub {
    constructor() {
        super('/interactions')
    }

    setRoutes(): void {
        this.setRoute('post', '', verifyKeyMiddleware(process.env.PUBLIC_KEY))
        this.setRoute('post', '', verifyKeyMiddleware(process.env.PUBLIC_KEY))
    }
}

export default InteractionRouterHub