import Command from "../command/Command/Command.ts";
import Curator from "../employee/Curator.ts";
import { GuildMember, isHumanMember } from "../types/discordGuildMemberObject.type.ts";
import DiscordRequest from "../util/discordRequest.ts";
import { HTTPMethod } from "../util/httpMethod.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import Archive from "./Archive.ts";

export class CommandArchive extends Archive{}

class CommandCurator extends Curator{
    constructor(){
        super(CommandArchive.getInstance())
    }


    // for use in interactionRouterCollector
    static findExecutionFromCommand(name:string) {
        const commands = CommandCurator.getFromArchive<Command[]>("commands")
        if (!commands){throw Error("commands are not added")}

        const execution = commands.find((command) => command.name === name)?.execution
        if (!execution){throw Error(`name : ${name} is not defined in commands`)}

        return  execution
    }

    setupArchive():this{
        this.addArchivePlan("guildMemberChoices", (async () => {
            const endPoint = `/guilds/${verifiedEnv.GUILD_ID}/members?limit=1000`
            const guildMembers:GuildMember[] = await DiscordRequest(endPoint, {method:HTTPMethod.GET})
            .then((res) => {return res.json()})
            .catch((err) => {throw Error(err)})

            const guildMemberChoices = guildMembers.filter((discordUser) => isHumanMember(discordUser)).map((discordUser) => ({
                name:discordUser.user.username,
                value:discordUser.user.id
            }))

            return guildMemberChoices
        })())

        return this
    }
}

export default CommandCurator