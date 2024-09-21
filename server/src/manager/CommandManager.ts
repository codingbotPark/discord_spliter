import { Express } from "express";
import { Employee } from "../util/Logger.ts";
import { Manager } from "./Manager.ts";
import Command from "../command/Command.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import DiscordRequest from "../util/discordRequest.ts";

// install command to discord guild
class CommandManager extends Employee implements Manager {
    private commands: Command[]

    constructor(commands: Command[]) {
        super()
        this.commands = commands
    }

    manage(): void {
        this.installAllCommand()
    }

    async installAllCommand() {
        // API endpoint to overwrite global commands
        const endpoint = `applications/${verifiedEnv.APP_ID}/commands`;

        try {
            await DiscordRequest(endpoint, { method: 'PUT', body: JSON.stringify(this.commands) });
        } catch (err) {
            console.error(err);
        }
    }
}

export default CommandManager