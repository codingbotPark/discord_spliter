import Collector from "../employee/Collector.ts";
import Command from "./Command/Command.ts";
import CommandOption, { ChoicesType } from "./CommandOption/CommandOption.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";
import CommandCurator, { CommandArchive } from "../archive/CommandCurator.ts";
import { Request, Response } from "express";
import { splitCommandHandler } from "./handlers/splitCommandHandler.ts";


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
                            value:"split with randomly"
                        },{
                            name:"game",
                            value:"split with game"
                        },
                    ]
                }),
                new CommandOption({
                    name: "game",
                    description: "split with game",
                    type: 3,
                    choices:[
                        {
                            name:"Overwatch",
                            value:"1 overwatch"
                        },{
                            name:"league of legends",
                            value:"2 LOL"
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
                description:"test2",
                name: 'test2',
                execution() {
                    console.log("test2")
                }
            })
        )

        return this
    }
    
}

export default SplitCommandCollector