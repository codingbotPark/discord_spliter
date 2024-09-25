import { HTTPMethod, HTTPMethodType } from "./httpMethod.ts";
import { verifiedEnv } from "./verifyEnv.ts";

interface discordRequestOptions{
  method:HTTPMethodType | HTTPMethod
  body?: any; // 본문, JSON 형식
  headers?: HeadersInit; // 추가 헤더
}

export default async function DiscordRequest(endpoint:string, options:discordRequestOptions) {
    // append endpoint to root API URL
    const url = 'https://discord.com/api/v10/' + endpoint;

    // Stringify payloads
    if (options.body && typeof options.body !== 'string') options.body = JSON.stringify(options.body);

    const headers:HeadersInit = {
        Authorization: `Bot ${verifiedEnv.DISCORD_TOKEN}`,
        'Content-Type': 'application/json; charset=UTF-8',
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