import express, {Express} from 'express'
import { Server } from 'http';
import 'dotenv/config';
import Logger from './util/Logger';

// App class role = turn on & off express server
class App {
    private app:Express
    private server:Server | null = null
    private logger:Logger

    constructor(){
        this.app = express()
        this.logger = new Logger
        this.initializeMiddleware()
    }

    private initializeMiddleware(){
        this.app.use(express.json()) // use json
        this.app.use(this.logger.logMiddleware) // use logging for every request
    }

    private getPort(presetPort:number):number{
        const envPort = Number(process.env.PORT)
        if (isNaN(envPort)){
            return presetPort
        }
        return envPort
    }
    
    openServer(presetPort:number){
        const port = this.getPort(presetPort)
        this.server = this.app.listen(port, () => {
            // logging for opening port
        })
    }

    publiccloseServer(){
        this.server?.close()
    }

}

const app = new App()
app.openServer(3000) // get port from env, or defalt 3000
