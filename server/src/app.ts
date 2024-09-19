import express, {Express} from 'express'
import 'dotenv/config';
import ServerManager from './ServerManager.ts';


// App class role = start & stop app
class App {
    private app:Express
    private serverManager:ServerManager

    constructor(serverManager:ServerManager){
        this.serverManager = serverManager
        this.app = express()
    }

    start(){
        console.log("server on")
        this.serverManager.openServer(this.app)
    }

    stop(){
        this.serverManager.closeServer()
    }

}

export default App
