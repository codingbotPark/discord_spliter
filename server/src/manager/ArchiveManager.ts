import { Express } from "express";
import Manager from "../employee/Manager.ts";
import Curator from "../employee/Curator.ts";
import DiscordCurator from "../archive/DiscordCurator.ts";
import { Client } from "discord.js";
import { verifiedEnv } from "../util/verifyEnv.ts";

class ArchiveManager extends Manager{
    curators:Curator[]

    constructor(curators:Curator[]){
        super()
        this.curators = curators
    }

    manage(app: Express | undefined): void {
    }

}

export default ArchiveManager