import { APIActionRowComponent, APIInteractionResponse, ButtonStyle, Component, ComponentType, InteractionResponseType } from "discord.js";
import { verifiedEnv } from "../../../util/verifyEnv.ts";



export function makeAuthAllowComponent({content}:{content:string}):APIInteractionResponse{

    const clientId = verifiedEnv.CLIENT_ID;
    const redirectUri = encodeURIComponent(verifiedEnv.REDIRECT_URI);
    const scope = 'identify+connections';
    const responseType = 'code';
    const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;    

    return {
        type:InteractionResponseType.ChannelMessageWithSource,
        data:{
            content,
            components:[
                {
                    type:ComponentType.ActionRow,
                    components:[
                        {
                            type:ComponentType.Button,
                            label:"allow",
                            url:discordAuthUrl,
                            style:ButtonStyle.Link
                        }
                    ]
                }
            ]
        }
    }
}