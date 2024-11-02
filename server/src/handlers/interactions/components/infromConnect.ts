import { ConnectionService, InteractionResponseType, MessageFlags } from "discord.js";


export function makeInformConnectionComponent({connectionService}:{connectionService:ConnectionService}){
    
    const content = `${connectionService} is not exist on your profile, please connection ${connectionService}`
    // or assigin temporary
    return {
        type:InteractionResponseType.ChannelMessageWithSource,
        data:{
            content,
            flags:MessageFlags.Ephemeral
        }
    }

}