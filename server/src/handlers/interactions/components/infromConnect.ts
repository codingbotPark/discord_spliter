import { ButtonStyle, ComponentType, ConnectionService, InteractionResponseType, MessageFlags } from "discord.js";


export function makeInformConnectionComponent({connectionService, unknownButtonCustomID}:{connectionService:ConnectionService, unknownButtonCustomID?:string}){
    
    const content = `${connectionService} is not exist on your profile, please connection ${connectionService}`
    // or assigin temporary
    return {
        type:InteractionResponseType.ChannelMessageWithSource,
        data:{
            content,
            flags:MessageFlags.Ephemeral,
            components:unknownButtonCustomID ?? [
                {
                    type:ComponentType.Button,
                    style:ButtonStyle.Secondary,
                    label:"join with unknown tier",
                    custom_id: unknownButtonCustomID
                }
            ]
        }
    }

}