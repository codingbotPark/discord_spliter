import { APIConnection, ConnectionService } from "discord.js";


function findConnection(connections:APIConnection[], connectionType:ConnectionService){
    const findedConnection = connections.find((connection) => connection.type === connectionType)
    if (!findedConnection){
        console.log(`there are no connection, ${connectionType}`)
        return null
    }

    return findedConnection
}

export default findConnection