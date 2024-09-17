import 'dotenv/config';
import { verifyKeyMiddleware } from "discord-interactions";
import Router from "./Router";

class InteractionRouter extends Router {
    constructor() {
        super('/interactions')
    }

    setRoutes(): void {
        this.setRoute('post', '', verifyKeyMiddleware(process.env.PUBLIC_KEY))
        this.setRoute('post', '', verifyKeyMiddleware(process.env.PUBLIC_KEY))
    }
}

export default InteractionRouter