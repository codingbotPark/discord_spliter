import Curator from "../employee/Curator.ts";
import Archive from "./Archive.ts";
import CommandCurator from "./CommandCurator.ts";

const curators:Curator<Archive>[] = [
    await new CommandCurator().setupArchive().executeArchivePlan()
]

export default curators