import Manager from "../employee/Manager.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import DiscordRequest from "../util/discordRequest.ts";
import commandCollectors, { CommandCollector } from "../command/index.ts";
import Command from "../command/Command/Command.ts";
import { HTTPMethod } from "../util/httpMethod.ts";

export const commandSpecification = [
    "test",
    "split"
] as const

// install command to discord guild
class CommandManager extends Manager {
    private commandCollectors: CommandCollector[]

    constructor(commandCollectors: CommandCollector[]) {
        super()
        this.commandCollectors = commandCollectors
    }

    manage(): void {
        this.commandCollectors.forEach((commandCollector) => commandCollector.collect())
        const commands = this.commandCollectors.map((commandCollector) => commandCollector.getCollection()).flat()
        console.log(commands)
        this.installAllCommand(commands)
    }

    async installAllCommand(commands:Array<Command>) {
        // API endpoint to overwrite global commands
        const endpoint = `applications/${verifiedEnv.APP_ID}/commands`;

        try {
            // DiscordRequest has 'command.json()' > function removed
            await DiscordRequest(endpoint, { method: HTTPMethod.PUT, body: commands });
            console.log("install commands successfully")
        } catch (err) {
            console.error(err);
        }
    }
}

export default CommandManager



