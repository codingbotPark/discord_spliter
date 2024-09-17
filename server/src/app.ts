import express, {Express} from 'express'
import { Server } from 'http';
import 'dotenv/config';
import Logger from './util/Logger';
import InteractionRouter from './routers/InteractionRouter';
import Router from './routers/Router';

// App class role = turn on & off express server
class App {
    private app:Express
    private server:Server | undefined = undefined
    private logger:Logger

    constructor(){
        this.app = express()
        this.logger = new Logger()
        this.initializeMiddleware() // base middleware (ex logger)
        /** @TODO decide class connecting struct */
        this.initializeRoute([new InteractionRouter()]) // base route('interactions' for use discord endpoint)
    }

    private initializeMiddleware(){
        this.app.use(this.logger.logMiddleware) // use logging for every request
    }

    private initializeRoute(routers:Router[]){
        routers.forEach(router => {
            router.initializeRoutes(); // regist detail routes
            this.app.use(router.basePath, router.getRouter());
        });
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

    closeServer(){
        this.server?.close(() => {
            // logging for closing server
        })
    }

}

const app = new App()
app.openServer(3000) // get port from env, or defalt 3000
