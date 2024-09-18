import App from "./App";
import InteractionRouter from "./routes/InteractionRouterHub";
import RouterManager from "./RouterManager";
import ServerManager from "./ServerManager";


const routerManager = new RouterManager([new InteractionRouter()])
const serverManager = new ServerManager(routerManager)
const app = new App(serverManager)
app.start()