import { verifiedEnv } from '../../util/verifyEnv.ts';
import RouterHub from './RouterHub.ts';
import RouterBuilder from '../RouterBuilder.ts';
import { HTTPMethod } from '../../util/httpMethod.ts';

class InteractionRouterHub extends RouterHub {
    constructor() {
        super('/interactions')
    }

    setRouters() {
        const routerBuilder = new RouterBuilder()
        this.addRouter(
            routerBuilder
            .setMethod(HTTPMethod.POST)
            // .addHandler() // verify to discord request middleware
            .addHandler(async function (req, res) {
                const { type, id, data } = req.body;

                /**
                 * Handle verification requests
                 */
                // if (type === InteractionType.PING) {
                //     return res.send({ type: InteractionResponseType.PONG });
                // }

                // if (type === InteractionType.APPLICATION_COMMAND){
                //     const { name } = data;

                //     // "test" command
                //     if (name === 'test') {
                //         // Send a message into the channel where command was triggered from
                //         return res.send({
                //         type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                //         data: {
                //             // Fetches a random emoji to send from a helper function
                //             content: `hello world`,
                //         },
                //         });
                //     }
                // }

                
            }).build()
        )

        return this
    }
}

export default InteractionRouterHub