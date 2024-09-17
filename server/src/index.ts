import App from "./App";
import InteractionRouter from "./routers/InteractionRouter";
import RouterManager from "./routers/RouterManager";
import ServerManager from "./ServerManager";


const routerManager = new RouterManager([new InteractionRouter()])
const serverManager = new ServerManager(routerManager)
const app = new App(serverManager)
app.start()