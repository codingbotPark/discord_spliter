import express, {Express} from 'express'
import { Server } from 'http';
import 'dotenv/config';
import InteractionRouter from './routes/InteractionRouterHub';
import Router from './routes/RouterHub';
import RouterManager from './RouterManager';
import ServerManager from './ServerManager';

// App class role = start & stop app
class App {
    private app:Express
    private serverManager:ServerManager

    constructor(serverManager:ServerManager){
        this.serverManager = serverManager
        this.app = express()
    }

    start(){
        this.serverManager.openServer(this.app)
    }

    stop(){
        this.serverManager.closeServer()
    }

}

export default App
