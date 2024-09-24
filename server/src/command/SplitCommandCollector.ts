import Collector from "../employee/Collector.ts";
import Command from "./class/Command.ts";
import CommandOption from "./class/CommandOption.ts";
import CommandBuilder from "./CommandBuilder.ts";
import { CommandCollector } from "./index.ts";


class SplitCommandCollector extends Collector<Command, CommandBuilder>{

    collect():this {
        this.addItemToCollection(
            this.equipment
            .set("name", "split")
            .set("type", 1)
            .set("description", "split void channel")
            .set("execution", () => {
                console.log("test1")
            })
            .set("options",[
                new CommandOption({
                    name: "game",
                    description: "split with game",
                    type: 3,
                    choices:[
                        {
                            name:"Overwatch",
                            value:"Overwatch API"
                        },{
                            name:"league of legends",
                            value:"league of legends API"
                        }
                    ]
                }),
                new CommandOption({
                    name:"random",
                    description:"split random",
                    min_value:2,
                    max_value:10,
                    type:4
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