import Router from "./routers/Router";
import RouterManager from "./routers/RouterManager";

// server class role = turn on & off express server
class Server {
    constructor(routers:RouterManager){

    }

    openServer(port:number){
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

export default Server