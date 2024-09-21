import Command from "../class/Command.ts";
import CommandOption from "../class/CommandOption.ts";
import CommandBuilder from "../CommandBuilder.ts";
import CommandOptionBuilder from "../CommandOptionBuilder.ts";


class splitCommandHub {
    commandBuilder = new CommandBuilder()
    commandOptionBuilder = new CommandOptionBuilder()
    private commands: Command[] = []

    constructor() { }

    setCommands() {
        this.addCommand(
            this.commandBuilder.set("name", 'game')
                .set("description", "split reference game")
                .set("type", 3)
                .set("execution", () => {
                    console.log("test1")
                })
                .set("options", [
                    new CommandOption({
                        name: "overwatch",
                        description: "overwatch API",
                        type: 3,
                    }),
                    new CommandOption({
                        name:"league of legends",
                        description: "league of legneds API",
                        type:3
                    })
                ])
                .build()
        )
        this.addCommand(
            new Command({
                type: 3,
                name: 'random',
                description: 'split random',
                execution() {
                    console.log("test2")
                }
            })
        )
    }

    getCommands() {

    }

    addCommand(command: Command) {
        this.commands.push(command)
    }
}

export default splitCommandHub