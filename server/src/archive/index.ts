import Curator from "../employee/Curator.ts";
import Archive from "./Archive.ts";
import CommandCurator from "./CommandCurator.ts";
import DiscordCurator from "./DiscordCurator.ts";

const curators:Curator[] = [
    await new CommandCurator().setupArchive().executeArchivePlan(),
    await new DiscordCurator().setupArchive().executeArchivePlan()
]

export default curators