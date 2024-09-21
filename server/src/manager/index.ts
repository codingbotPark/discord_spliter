import routerHubs from "../router";
import { EmployedManagerType } from "./Manager";
import RouterManager from "./RouterManager";
import ServerManager from "./ServerManager";


const managers:EmployedManagerType[] = [
    new ServerManager(),
    new RouterManager(routerHubs),
]

export default managers