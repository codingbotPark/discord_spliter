import Collector from "../employee/Collector.ts";
import Command from "./Command/Command.ts";
import CommandOption from "./CommandOption/CommandOption.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";
import CommandCurator  from "../archive/CommandCurator.ts";
import { Request, Response } from "express";
import { splitCommandHandler } from "./handlers/splitCommandHandler.ts";
import { ButtonStyleTypes, InteractionResponseType, InteractionType, MessageComponentTypes } from "discord-interactions";
import DiscordRequest from "../util/discordRequest.ts";
import { HTTPMethod } from "../util/httpMethod.ts";

export enum SplitMethod {
    RANDOM = "random",
    GAME = "game",
}



class SplitCommandCollector extends Collector<Command, CommandBuilder>{


    collect():this {
        this.addItemToCollection(
            this.equipment
            .set("name", "split")
            .set("type", 1)
            .set("description", "split void channel")
            .set("execution", splitCommandHandler)
            // name should not include space char
            .set("options",[
                new CommandOption({
                    name:"method",
                    description:"spliting method",
                    type:3,
                    choices:[
                        {
                            name:"random",
                            value:"random",
                        },{
                            name:"game",
                            value:"game"
                        },
                    ]
                }),
                new CommandOption({
                    name: "game",
                    description: "split with game",
                    type: 3,
                    choices:[
                        {
                            name:"league of legends",
                            value:"LOL"
                        },{
                            name:"Valorant",
                            value:"Valorant"
                        }
                    ]
                }),
                new CommandOption({
                    name:"channel_number",
                    description:"channel number",
                    min_value:2,
                    max_value:10,
                    type:4
                }),
                new CommandOption({
                    name:"exclude_user",
                    description:"exclude changing member",
                    type:3,
                    choices:CommandCurator.getFromArchive("guildMemberChoices")
                })
            ])
            .build()
        )

        this.addItemToCollection(
            new Command({
                type: 1,
                description:"test",
                name: 'test',
                execution:async(req: Request, res: Response) => {
                    const {data, type} = req.body

                    if (type === InteractionType.MESSAGE_COMPONENT){
                        console.log("들어옴")
                        const componentId = data.custom_id;
                
                        if (componentId === 'test1') {
                      
                            const endPoint = "/users/@me/connections"
                            const connections = await DiscordRequest(endPoint, {method:HTTPMethod.GET})
                            .then((res) => res.json())
                            .catch((err) => {throw Error(err)})
                            console.log(connections)
                      
                            // Send results
                            return res.send({
                              type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                              data: { content: `test complete` },
                            });
                          }
                    }

                    return res.send({
                        type:InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data:{
                            content:"test",
                            components:[
                                {
                                    type:MessageComponentTypes.ACTION_ROW,
                                    components:[
                                        {
                                            type:MessageComponentTypes.BUTTON,
                                            custom_id:"test1",
                                            label:"test1",
                                            style:ButtonStyleTypes.PRIMARY
                                        }
                                        
                                    ]
                                }
                            ]
                        }
                    })
                }
            })
        )

        return this
    }
    
}

export default SplitCommandCollector