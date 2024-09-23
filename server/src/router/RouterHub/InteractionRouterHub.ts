import RouterHub from './RouterHub.ts';
import RouterBuilder from '../RouterBuilder.ts';
import { HTTPMethod } from '../../util/httpMethod.ts';
import { Request, Response } from 'express';

class InteractionRouterHub extends RouterHub {
    constructor() {
        super('/interactions')
    }

    setRouters() {
        const routerBuilder = new RouterBuilder()
        this.addRouter(
            routerBuilder
            .set("method", HTTPMethod.POST)
            .addHandler((req: Request, res: Response) => {

            })
            .build()
        )

        return this
    }
}

export default InteractionRouterHub