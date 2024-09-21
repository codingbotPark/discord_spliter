import commandObjects from "./commandObjects.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import { installCommand } from "./installCommands.ts";

installCommand(verifiedEnv.APP_ID, commandObjects)
