import { APIConnection, ConnectionService } from "discord.js";


export function findConnection(connections:APIConnection[], connectionType:ConnectionService){
    const findedConnection = connections.find((connection) => connection.type === connectionType)
    if (!findedConnection){
        console.log(`there are no connection, ${connectionType}`)
        return null
    }

    return findedConnection
}

export async function getUserConnections(accessToken:string):Promise<APIConnection[]>{
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
