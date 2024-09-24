import Builder from "../employee/Builder.ts";
import Command from "./class/Command.ts";

// CommandBuilder class role = build command
class CommandBuilder extends Builder<Command>{

    private isCommand(data: Partial<Command>): data is Command {
        return (
            typeof data.name === "string" &&
            // typeof data.description === "string" &&
            typeof data.execution === "function"
        );
    }

    // return Command, after handling exception
    build():Command{
        if (!this.isCommand(this.building)) {
            throw Error()
            // missing require property 
        }
        return new Command(this.building)
    }
}


export default CommandBuilder