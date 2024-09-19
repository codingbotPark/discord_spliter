import App from "./App.ts";
import routerHubs from "./router/index.ts";
import RouterManager from "./RouterManager.ts";
import ServerManager from "./ServerManager.ts";

const routerManager = new RouterManager(routerHubs)
const serverManager = new ServerManager(routerManager)
const app = new App(serverManager)
app.start()