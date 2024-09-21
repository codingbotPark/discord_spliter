import DiscordRequest from "./discordRequest.ts";


/** @TDOO check commands type in discrd-interface */
export async function installCommand(appID:string, commands:any){
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appID}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
    console.log("commands installed successfully")
  } catch (err) {
    console.error(err);
  }
  
}

