import 'dotenv/config';
import { verifyKeyMiddleware } from "discord-interactions";
import Router from "./Router";

class InteractionRouter extends Router {
    constructor() {
        super('/interactions')
    }

    initializeRoutes(): void {
        this.registRoute('post', '', verifyKeyMiddleware(process.env.PUBLIC_KEY), 로직1)
        this.registRoute('post', '', verifyKeyMiddleware(process.env.PUBLIC_KEY), 로직2)
    }
}

export default InteractionRouter