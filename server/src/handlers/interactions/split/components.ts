import { APIActionRowComponent, APIButtonComponent, APIInteractionResponse, APIStringSelectComponent, APIUserSelectComponent, ButtonStyle, ComponentType, InteractionResponseType } from "discord.js";
import { SplitInfoType } from "./split";
import { setDefaultOption } from "../setDefaultOption.ts";


export function makeNeedInfoComponent(splitInfo:SplitInfoType):APIInteractionResponse{
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
                            custom_id: "split_requestSplit1_method",
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
                {
                    type:ComponentType.ActionRow,
                    components:[
                        {
                            type: ComponentType.Button,
                            custom_id: "split_submit",
                            label: "submit",
                            style: ButtonStyle.Primary
                        }
                    ]
                } as APIActionRowComponent<APIButtonComponent>
            ]
        }
    }
}