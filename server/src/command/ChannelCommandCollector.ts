import Collector from "../employee/Collector.ts";
import Command from "./Command/Command.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";
import CommandOption from "./Command/CommandOption/CommandOption.ts";



class ChannelCommandCollector extends Collector<Command, CommandBuilder>{
    collect(): void {
        // channel assemble
        this.addItemToCollection(
            this.equipment
            .set("name", "assemble")
            .set("description", "assemble members to one channel")
            .set("options", [
                new CommandOption({
                    name:"to",
                    description:"target channel",
                    type:7
                }),
                new CommandOption({
                    name:"select",
                    description:"select assemble channel",
                    channel_types:[2],
                    type:7,
                })
            ]).build()
        )
    }
}

export default ChannelCommandCollector