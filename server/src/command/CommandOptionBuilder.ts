import Builder from "../employee/Builder.ts";
import CommandOption from "./class/CommandOption.ts";

// CommandBuilder class role = build command
class CommandOptionBuilder extends Builder<CommandOption>{

    private isCommandOption(data: Partial<CommandOption>): data is CommandOption {
        return (
            typeof data.name === "string" &&
            typeof data.description === "string" &&
            typeof data.type === "number"
        );
    }

    // return CommandOption, after handling exception
    build():CommandOption{
        if (!this.isCommandOption(this.building)) {
            throw Error()
            // missing require property 
        }
        return new CommandOption(this.building)
    }
}


export default CommandOptionBuilder