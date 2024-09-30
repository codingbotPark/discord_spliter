import express, {Express} from 'express'
import 'dotenv/config';
import Manager from './employee/Manager';
import { Client } from 'discord.js';
import { verifiedEnv } from "./util/verifyEnv.ts";


// App class role = start & stop app
class App {
    private app:Express
    private managers:Manager[]

    constructor(managers:Manager[]){
        this.app = express()
        this.managers = managers
    }

    start(){
        console.log("server on")
        this.managers.forEach((manager) => manager.manage(this.app))
    }

    stop(){
        this.managers.forEach((manager) => manager.fired())
    }

}

export default App
