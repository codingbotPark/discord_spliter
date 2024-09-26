import { Express } from "express";
import Manager from "../employee/Manager.ts";
import Curator from "../employee/Curator.ts";
import Archive from "../archive/Archive.ts";

class ArchiveManager extends Manager{
    curators:Curator<Archive>[]

    constructor(curators:Curator<Archive>[]){
        super()
        this.curators = curators
    }

    manage(app: Express | undefined): void {
        // console.log(CommandArchive.getInstance().getData("guildMemberChoices"))
    }

}

export default ArchiveManager