import { RequestHandler } from "express";
import { ChoicesType, ChoiceType } from "../../command/Command/CommandOption/CommandOption";
import { SplitMethod } from "../../command/SplitCommandCollector";
import { RegisteredGames } from "../../gameAPI";
import { APIActionRowComponent, APIInteractionResponse, APIStringSelectComponent, APIUserSelectComponent, ComponentType, InteractionResponseType } from "discord.js";
import { setDefaultOption } from "./setDefaultOption";
import { MessageComponentTypes } from "discord-interactions";

// return type in excuting against command
interface SplitInfoType {
    excludeUser?: Array<string>;
    method?: SplitMethod,
    channel_number?: number,
    game?: RegisteredGames,
}
function choicesToSplitInfo(choices:ChoicesType):SplitInfoType{
    return choices.reduce((obj: { [key: string]: string | number }, option: ChoiceType) => {
        obj[option.name] = option.value
        return obj
    }, {})
}


interface CompletedSplitInfoType extends SplitInfoType {
    method:SplitMethod,
    game:RegisteredGames,
}
function areOptionsCompleted(splitInfo:SplitInfoType):splitInfo is CompletedSplitInfoType{
    return !!(splitInfo.method && splitInfo.game)
}
function fillOptions(splitInfo:SplitInfoType):SplitInfoType{
    // working to find options

    return splitInfo;
}


const split:RequestHandler = async(req, res) => {
    const {guild_id, data} = req.body
    const {user} = req.body.member
    
    const options = data.options as ChoicesType
    const splitInformation: SplitInfoType = choicesToSplitInfo(options)
    const confirmedSplitInfo = fillOptions(splitInformation)
    
    if (!areOptionsCompleted(confirmedSplitInfo)){ // return component to fill info
        return res.send(makeNeedInfoComponent(confirmedSplitInfo))
    }

    // get splited member
    
    

 
}

export default split




function makeNeedInfoComponent(splitInfo:SplitInfoType):APIInteractionResponse{
    return {
        type:InteractionResponseType.ChannelMessageWithSource,
        data:{
            content:`fail to divide channel, give me more information to split channel`,
            components:[
                {
                    type: ComponentType.ActionRow,
                    components:[
                        {
                            type:ComponentType.StringSelect,
                            custom_id: "requestSplit1_method",
                            placeholder: "spliting method*",
                            min_values: 1,
                            max_values: 1,
                            options: setDefaultOption([
                                {
                                    label: "game",
                                    description: "divide with game",
                                }, {
                                    label: "random",
                                    description: "divide with game",
                                },
                            ], splitInfo["method"]), 
                        }
                    ]
                } as APIActionRowComponent<APIStringSelectComponent>,
                {
                    type:ComponentType.ActionRow,
                    components:[
                        {
                            type:ComponentType.StringSelect,
                            custom_id:"requestSplit2_game",
                            placeholder:"game*",
                            min_values:1,
                            max_values:1,
                            options:setDefaultOption([
                                {
                                    label:"league of legends",
                                    value:"LOL",
                                    description:"using LOL API"
                                },{
                                    label:"Valorant",
                                    value:"Valorant",
                                    description:"using Valorant API"
                                }
                            ])
                        }
                    ]
                } as APIActionRowComponent<APIStringSelectComponent>,
                {
                    type:ComponentType.ActionRow,
                    components:[
                        {
                            type: ComponentType.StringSelect,
                            custom_id:"requestSplit3_channelNumber",
                            placeholder:"channel number",
                            min_values:1,
                            max_values:1,
                            options:setDefaultOption(
                                Array.from({length:20}, (_, idx) => {
                                    const index = idx + 1;
                                    return { label: index.toString(), value: index.toString() };
                                }), splitInfo["channel_number"]?.toString() ?? "2")
                        }
                    ]
                } as APIActionRowComponent<APIStringSelectComponent>,
                {
                    type:ComponentType.ActionRow,
                    components:[
                        {
                            type:ComponentType.UserSelect,
                            custom_id:"requestSplit4_excludeUser",
                            placeholder:"exclude user",
                            min_values:1,
                            max_values:25,
                        }
                    ]
                } as APIActionRowComponent<APIUserSelectComponent>,
            ]
        }
    }
}