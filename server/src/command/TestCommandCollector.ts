import Collector from "../employee/Collector.ts";
import Command from "./Command/Command.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";



class TestCommandCollector extends Collector<Command, CommandBuilder>{
    collect(): void {
        this.addItemToCollection(
            new Command({
                type: 1,
                description:"test",
                name: 'test',
            })
        )
    }   
}

export default TestCommandCollector