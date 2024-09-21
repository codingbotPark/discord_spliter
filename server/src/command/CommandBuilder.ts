import Command from "./class/Command.ts";

// CommandBuilder class role = build command
class CommandBuilder{
    private data: Partial<Command> = {};

    set<K extends keyof Command>(key: K, value: Command[K]): this {
        this.data[key] = value;
        return this;
    }

    private isCommand(data: Partial<Command>): data is Command {
        return (
            typeof data.name === "string" &&
            typeof data.description === "string" &&
            typeof data.execution === "function"
        );
    }

    // return Command, after handling exception
    build():Command{
        if (!this.isCommand(this.data)) {
            throw Error()
            // missing require property 
        }
        return new Command(this.data)
    }
}


export default CommandBuilder