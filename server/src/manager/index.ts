import commandCollectors from "../command/index.ts";
import routerCollections from "../router/index.ts";
import Manager from "../employee/Manager.ts";
import CommandManager from "./CommandManager.ts";
import RouterManager from "./RouterManager.ts";
import ServerManager from "./ServerManager.ts";


const managers:Manager[] = [
    new ServerManager(),
    new RouterManager(routerCollections),
    // // split installation manager because regist command limitation
    // new CommandManager(commandCollectors) 
]

export default managers