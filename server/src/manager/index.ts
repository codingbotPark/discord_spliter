import routerCollections from "../router/index.ts";
import Manager from "../employee/Manager.ts";
import RouterManager from "./RouterManager.ts";
import ServerManager from "./ServerManager.ts";
import ArchiveManager from "./ArchiveManager.ts";
import curators from "../archive/index.ts";


const managers:Manager[] = [
    new ServerManager(),
    new RouterManager(routerCollections),
    // // split installation manager because regist command limitation
    // new CommandManager(commandCollectors) 
    new ArchiveManager(curators)
]

export default managers