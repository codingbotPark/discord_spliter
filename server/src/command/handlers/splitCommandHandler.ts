import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Request, Response } from "express";


export const splitCommandHandler = (req: Request, res: Response) => {
    // Interaction type and data
    const { type, id, data } = req.body;

    if (type === InteractionType.PING) {
        return res.send({ type: InteractionResponseType.PONG });
    }

    if (type === InteractionType.APPLICATION_COMMAND) {
        const { name } = data;

        if (name==="split"){
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                  // Fetches a random emoji to send from a helper function
                  content: `hello world`,
                },
              });
        }
    }
    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
}