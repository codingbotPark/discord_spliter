import DiscordRequest from "./discordRequest.ts";
import commandObjects from "./commandObjects.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";

/** @TDOO check commands type in discrd-interface */
async function installCommand(appID:string, commands:any){
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appID}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }

  console.log("commands installed successfully")
}

installCommand(verifiedEnv.APP_ID, commandObjects)
