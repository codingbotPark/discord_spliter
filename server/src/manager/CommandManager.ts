import Manager from "../employee/Manager.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import DiscordRequest from "../util/discordRequest.ts";
import { CommandCollector } from "../command/index.ts";
import Collector from "../employee/Collector.ts";



// install command to discord guild
class CommandManager extends Manager {
    private commandCollectors: CommandCollector[]

    constructor(commandCollectors: CommandCollector[]) {
        super()
        this.commandCollectors = commandCollectors
    }

    manage(): void {
        this.installAllCommand()
    }

    async installAllCommand() {
        // API endpoint to overwrite global commands
        const endpoint = `applications/${verifiedEnv.APP_ID}/commands`;

        try {
            await DiscordRequest(endpoint, { method: 'PUT', body: JSON.stringify(this.commandCollectors) });
        } catch (err) {
            console.error(err);
        }
    }
}

export default CommandManager