import routerCollections from "../router/index.ts";
import Manager from "../employee/Manager.ts";
import RouterManager from "./RouterManager.ts";
import ServerManager from "./ServerManager.ts";
import CommandManager from "./CommandManager.ts";
import commandCollectors from "../command/index.ts";


const managers:Manager[] = [
    new ServerManager(),
    new RouterManager(routerCollections),
    new CommandManager(commandCollectors),
]

export default managers