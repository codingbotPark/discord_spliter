import { Employee } from "../util/Logger.ts";
import { Manager } from "./Manager.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import DiscordRequest from "../util/discordRequest.ts";
import CommandHub from "../command/CommandHub/CommandHub.ts";

// install command to discord guild
class CommandManager extends Employee implements Manager {
    private commandHubs: CommandHub[]

    constructor(commandHubs: CommandHub[]) {
        super()
        this.commandHubs = commandHubs
    }

    manage(): void {
        this.installAllCommand()
    }

    async installAllCommand() {
        // API endpoint to overwrite global commands
        const endpoint = `applications/${verifiedEnv.APP_ID}/commands`;

        try {
            await DiscordRequest(endpoint, { method: 'PUT', body: JSON.stringify(this.commandHubs) });
        } catch (err) {
            console.error(err);
        }
    }
}

export default CommandManager