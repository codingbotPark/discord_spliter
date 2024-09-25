import routerCollections from "../router/index.ts";
import Manager from "../employee/Manager.ts";
import RouterManager from "./RouterManager.ts";
import ServerManager from "./ServerManager.ts";


const managers:Manager[] = [
    new ServerManager(),
    new RouterManager(routerCollections),
    // // split installation manager because regist command limitation
    // new CommandManager(commandCollectors) 
]

export default managers