import { InteractionResponseType, InteractionType } from "discord-interactions";
import { Request, Response } from "express";
import { ChoicesType, ChoiceType } from "../CommandOption/CommandOption";
import DiscordRequest from "../../util/discordRequest.ts";
import { HTTPMethod } from "../../util/httpMethod.ts";
import { verifiedEnv } from "../../util/verifyEnv.ts";
import { Client, GuildMember } from "discord.js";
import DiscordCurator from "../../archive/DiscordCurator.ts";
import { isDiscordHumanMember } from "../../types/discordGuildMemberObject.type.ts";
import { gameAPI, isRegisteredGame, RegisteredGames } from "../../api/game/index.ts";



// return type in excuting against command
interface SplitCommandReturnType{
    excludeUser?:Array<string>;
    method?:"random" | "game",
    channel_number?:number,
    game?:RegisteredGames,
    randomForce?:boolean, // when split with randomly because the fetching failed => true
}

/** @TODO foo */
export const splitCommandHandler = async (req: Request, res: Response) => {
    const {guild_id} = req.body
    const {user} = req.body.member
    const data = req.body.data
    // typed options getting with array
    const options = data.options ?? [] as ChoicesType

    // transform options to obj
    const choices:SplitCommandReturnType = options.reduce((obj:{[key:string]:string | number}, option:ChoiceType) => {
        obj[option.name] = option.value
        return obj
    },{})

    const guildMembers = await getGuildMembers(guild_id)

    const currentUser = guildMembers.get(user.id)
    guildMembers.delete(user.id) // remove current user

    const currentUserPrecense = currentUser?.presence // precense or undefined
    const currentUserActivity = currentUserPrecense?.activities[0].name // get recently activity
    const precenseHumans = guildMembers.filter((guildMember) => isDiscordHumanMember(guildMember) && isPresenceMember(guildMember))
    // if currentUserActivity = undefined => samePrecenseHuman = []
    const samePrecenseHumans = precenseHumans.filter((human) => !!human.presence?.activities.find((act) => act.name === currentUserActivity))


    // 못 나눌 때는 유저에게 선택 창을 보낸다

    if (samePrecenseHumans.values.length){

        if (choices["method"] !== "random" && isRegisteredGame(currentUserActivity!)) {
            const members:any = gameAPI[currentUserActivity]() /**@TODO change */
            // discord activity type 이 뭔지 찾기
            // change voice channel referencing members
            // 되돌리기 UI response
        }

    }

    // 디테일 설정 UI response

    return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: `hello world`,
        },
      });
}



async function getGuildMembers(guildId:string){
    const client = DiscordCurator.getFromArchive<Client>("client")
    if (!client) throw Error("there are no client")

    const guild = client.guilds.cache.get(guildId)
    if (!guild) throw Error("there are no guild")

    const guildMembers = await guild.members.fetch()

    return guildMembers
}

function isPresenceMember(member:GuildMember){
    return member.presence
}

function getRandomMember(options:SplitCommandReturnType):Array<[]>{
    return []
}