import { ButtonStyle, ComponentType, ConnectionService, InteractionResponseType, MessageFlags } from "discord.js";


export function makeInformUnknownComponent({contentMessage, unknownButtonCustomID}:{contentMessage:string, unknownButtonCustomID?:string}){
    return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
            content: contentMessage,
            flags: MessageFlags.Ephemeral,
            ...(unknownButtonCustomID && {
                components: [{
                    type: ComponentType.ActionRow,
                    components: [{
                        type: ComponentType.Button,
                        style: ButtonStyle.Secondary,
                        label: "join with unknown tier",
                        custom_id: unknownButtonCustomID
                    }]
                }]
            })
        }
    };
}