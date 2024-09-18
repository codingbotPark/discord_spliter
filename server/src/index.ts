import App from "./App";
import routerHubs from "./router";
import RouterManager from "./RouterManager";
import ServerManager from "./ServerManager";


const routerManager = new RouterManager(routerHubs)
const serverManager = new ServerManager(routerManager)
const app = new App(serverManager)
app.start()