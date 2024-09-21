import commandObjects from "./commandObjects.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import { installCommand } from "./installCommands.ts";

installCommand(verifiedEnv.APP_ID, commandObjects)

// const url = `https://discord.com/api/v10/guilds/${verifiedEnv.GUILD_ID}/members`;