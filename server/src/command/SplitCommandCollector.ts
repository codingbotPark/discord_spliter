import Collector from "../employee/Collector.ts";
import Command from "./class/Command.ts";
import CommandOption from "./class/CommandOption.ts";
import CommandBuilder from "./CommandBuilder.ts";
import { CommandCollector } from "./index.ts";


class SplitCommandCollector extends Collector<Command, CommandBuilder>{

    collect():this {
        this.addItemToCollection(
            this.equipment
            .set("name", "game")
            .set("type", 3)
            .set("execution", () => {
                console.log("test1")
            })
            // .set("options",[
            //     new CommandOption({
            //         name: "overwatch",
            //         description: "overwatch API",
            //         type: 3,
            //     }),
            //     new CommandOption({
            //         name:"league-of-legends",
            //         description: "league of legneds API",
            //         type:3
            //     })
            // ])
            .build()
        )

        this.addItemToCollection(
            new Command({
                type: 3,
                name: 'random',
                execution() {
                    console.log("test2")
                }
            })
        )

        return this
    }
    
}

export default SplitCommandCollector