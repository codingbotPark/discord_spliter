import CommandOption from "./class/CommandOption.ts";

// CommandBuilder class role = build command
class CommandOptionBuilder{
    private data: Partial<CommandOption> = {};

    set<K extends keyof CommandOption>(key: K, value: CommandOption[K]): this {
        this.data[key] = value;
        return this;
    }

    private isCommandOption(data: Partial<CommandOption>): data is CommandOption {
        return (
            typeof data.name === "string" &&
            typeof data.description === "string" &&
            typeof data.type === "number"
        );
    }

    // return CommandOption, after handling exception
    build():CommandOption{
        if (!this.isCommandOption(this.data)) {
            throw Error()
            // missing require property 
        }
        return new CommandOption(this.data)
    }
}


export default CommandOptionBuilder