import Manager from "../employee/Manager.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import DiscordRequest from "../util/discordRequest.ts";
import commandCollectors, { CommandCollector } from "../command/index.ts";
import Command from "../command/class/Command.ts";
import { HTTPMethod } from "../util/httpMethod.ts";



// install command to discord guild
class CommandManager extends Manager {
    private commandCollectors: CommandCollector[]

    constructor(commandCollectors: CommandCollector[]) {
        super()
        this.commandCollectors = commandCollectors
    }

    manage(): void {
        const commands = this.commandCollectors.map((commandCollector) => commandCollector.collect().getCollection()).flat()
        console.log(commands)
        console.log(JSON.stringify(commands))
        this.installAllCommand(commands)
    }

    async installAllCommand(commands:Array<Command>) {
        // API endpoint to overwrite global commands
        const endpoint = `applications/${verifiedEnv.APP_ID}/commands`;

        try {
            await DiscordRequest(endpoint, { method: HTTPMethod.PUT, body: commands });
            console.log("install commands successfully")
        } catch (err) {
            console.error(err);
        }
    }
}

export default CommandManager

const commandManager = new CommandManager(commandCollectors)
commandManager.manage()


