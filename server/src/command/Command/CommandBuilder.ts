import Builder from "../../employee/Builder.ts";
import Command from "./Command.ts";

// CommandBuilder class role = build command
class CommandBuilder extends Builder<Command>{

    private isCommand(data: Partial<Command>): data is Command {
        return (
            typeof data.name === "string"
            // typeof data.description === "string" &&
        );
    }

    // return Command, after handling exception
    build():Command{
        if (!this.isCommand(this.building)) {
            throw Error()
            // missing require property 
        }
        const result = new Command(this.building)
        this.clear()
        return result
    }
}


export default CommandBuilder