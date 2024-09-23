import commandHubs from "../command";
import routerHubs from "../router";
import CommandManager from "./CommandManager";
import { EmployedManagerType } from "./Manager";
import RouterManager from "./RouterManager";
import ServerManager from "./ServerManager";


const managers:EmployedManagerType[] = [
    new ServerManager(),
    new RouterManager(routerHubs),
    new CommandManager(commandHubs)
]

export default managers