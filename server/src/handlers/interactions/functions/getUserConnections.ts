import { APIConnection } from "discord.js";

async function getUserConnections(accessToken:string):Promise<APIConnection[]>{
    // Fetch user connections using the access token
    const connectionsResponse = await fetch('https://discord.com/api/v10/users/@me/connections', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    if (!connectionsResponse.ok) {
        throw new Error(`Fetching connections failed: ${connectionsResponse.status}`);
    }

    const connections = await connectionsResponse.json();
    return connections as APIConnection[]
}


export default getUserConnections