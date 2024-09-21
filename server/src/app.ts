import express, {Express} from 'express'
import 'dotenv/config';
import { EmployedManagerType, Manager } from './manager/Manager.ts';


// App class role = start & stop app
class App {
    private app:Express
    private managers:EmployedManagerType[]

    constructor(managers:EmployedManagerType[]){
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
