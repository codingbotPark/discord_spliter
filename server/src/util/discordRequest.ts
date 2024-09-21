import { verifiedEnv } from "./verifyEnv.ts";

export default async function DiscordRequest(endpoint:string, options:RequestInit) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;

    // Stringify payloads
    if (options.body && typeof options.body !== 'string') options.body = JSON.stringify(options.body);

    const headers:HeadersInit = {
        Authorization: `Bot ${verifiedEnv.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
      }

    // Use fetch to make requests
    const res = await fetch(url, {
      method:options.method,
      headers,
      body:options.body
    });

    // throw API errors
    if (!res.ok) {
      const data = await res.json();
      console.log(res.status);
      throw new Error(JSON.stringify(data));
    }

    // return original response
    return res;
  }