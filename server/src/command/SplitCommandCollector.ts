import Collector from "../employee/Collector.ts";
import Command from "./Command/Command.ts";
import CommandOption from "./Command/CommandOption/CommandOption.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";

export enum SplitMethod {
    RANDOM = "random",
    GAME = "game",
}



class SplitCommandCollector extends Collector<Command, CommandBuilder>{


    async collect() {
        this.addItemToCollection(
            this.equipment
            .set("name", "split")
            .set("type", 1)
            .set("description", "split void channel")
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
                // new CommandOption({
                //     name:"exclude_user",
                //     description:"exclude changing member",
                //     type:3,
                //     // choices: there are no way to get member in once command install 
                // })
            ])
            .build()
        )

        this.addItemToCollection(
            new Command({
                type: 1,
                description:"test",
                name: 'test',
            })
        )

    }
    
}

export default SplitCommandCollector