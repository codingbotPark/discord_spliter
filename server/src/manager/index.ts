import routerCollections from "../router/index.ts";
import Manager from "../employee/Manager.ts";
import RouterManager from "./RouterManager.ts";
import ServerManager from "./ServerManager.ts";
import ArchiveManager from "./ArchiveManager.ts";
import curators from "../archive/index.ts";
import CommandManager from "./CommandManager.ts";
import commandCollectors from "../command/index.ts";


const managers:Manager[] = [
    new ArchiveManager(curators),
    new CommandManager(commandCollectors),
    new ServerManager(),
    new RouterManager(routerCollections),
]

export default managers