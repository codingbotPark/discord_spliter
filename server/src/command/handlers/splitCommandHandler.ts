import { ButtonStyleTypes, InteractionResponseType, MessageComponentTypes } from "discord-interactions";
import { Request, Response } from "express";
import { ChoicesType, ChoiceType } from "../CommandOption/CommandOption";
import { Client, Component, ComponentType, GuildMember, Message, TextInputStyle } from "discord.js";
import DiscordCurator from "../../archive/DiscordCurator.ts";
import { isDiscordHumanMember } from "../../types/discordGuildMemberObject.type.ts";
import { gameAPI, isRegisteredGame, RegisteredGames } from "../../api/game/index.ts";
import { SplitMethod } from "../SplitCommandCollector.ts";
import { generateOptions } from "./components/generateOptions.ts";



// return type in excuting against command
interface SplitCommandReturnType {
    excludeUser?: Array<string>;
    method?: SplitMethod,
    channel_number?: number,
    game?: RegisteredGames,
    randomForce?: boolean, // when split with randomly because the fetching failed => true
}

/** @TODO foo */
export const splitCommandHandler = async (req: Request, res: Response) => {
    const { guild_id } = req.body
    const { user } = req.body.member
    const data = req.body.data
    // typed options getting with array
    const options = data.options ?? [] as ChoicesType

    // transform options to obj
    const choices: SplitCommandReturnType = options.reduce((obj: { [key: string]: string | number }, option: ChoiceType) => {
        obj[option.name] = option.value
        return obj
    }, {})

    const guildMembers = await getGuildMembers(guild_id)

    const currentUser = guildMembers.get(user.id)
    guildMembers.delete(user.id) // remove current user

    const currentUserPrecense = currentUser?.presence // precense or undefined
    // prioritize get choices game, and get recently activity
    const currentUserActivity = currentUserPrecense?.activities.find((activity) => activity.name === choices["game"])?.name ?? currentUserPrecense?.activities[0].name
    const precenseHumans = guildMembers.filter((guildMember) => isDiscordHumanMember(guildMember) && isPresenceMember(guildMember))
    // if currentUserActivity = undefined => samePrecenseHuman = []
    const samePrecenseHumans = precenseHumans.filter((human) => !!human.presence?.activities.find((act) => act.name === currentUserActivity))


    // 못 나눌 때는 유저에게 선택 창을 보낸다

    if (samePrecenseHumans.values.length) {

        if (choices.method !== SplitMethod.RANDOM && isRegisteredGame(currentUserActivity!)) {
            const members: any = gameAPI[currentUserActivity]() /**@TODO change */
            // discord activity type 이 뭔지 찾기
            // activity type 
            // 0 = playing game
            // 1 = streaming
            // 2 = listening ex spotify
            // 3 = watching somthing
            // 4 = custom status
            // 5 = competition / rank game

            // change voice channel referencing members

            // 되돌리기 UI response
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {
                    content: "I changed team, do you want to revert?",
                    components: [
                        {
                            type: MessageComponentTypes.BUTTON,
                            custom_id: `revert_button_${req.body.id}`,
                            label: 'Revert',
                            style: ButtonStyleTypes.DANGER,
                        }
                    ]
                }
            })
        }

    }

    // 디테일 설정 UI response

    return res.send(
        {
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
                content: `fail to divide channel, give me more information to split channel`,
                components: [
                    {
                        type:MessageComponentTypes.ACTION_ROW,
                        components:[
                            {
                                type: MessageComponentTypes.STRING_SELECT,
                                custom_id: "requestSplit1_method",
                                placeholder: "spliting method",
                                min_values: 1,
                                max_values: 1,
                                options: generateOptions([
                                    {
                                        label: "game",
                                        description: "divide with game",
                                    }, {
                                        label: "random",
                                        description: "divide with game",
                                    },
                                ], choices["method"]),
                            }
                        ]
                    },{
                        type:MessageComponentTypes.ACTION_ROW,
                        components:[
                            {
                                type: MessageComponentTypes.STRING_SELECT,
                                custom_id:"requestSplit2_game",
                                placeholder:"game",
                                min_value:1,
                                max_value:1,
                                options:generateOptions([
                                    {
                                        label:"league of legends",
                                        value:"LOL",
                                        description:"using LOL API"
                                    },{
                                        label:"Valorant",
                                        value:"Valorant",
                                        description:"using Valorant API"
                                    }
                                ])
                            }
                        ]
                    },
                    {
                        type:MessageComponentTypes.ACTION_ROW,
                        components:[
                            {
                                type: MessageComponentTypes.STRING_SELECT,
                                custom_id:"requestSplit3_channelNumber",
                                placeholder:"channel number",
                                min_length:1,
                                max_length:1,
                                options:generateOptions(
                                    Array.from({length:20}, (_, idx) => {
                                        const index = idx + 1;
                                        return { label: index.toString(), value: index.toString() };
                                    }), "2")
                            }
                        ]
                    }
                    ,{
                        type:MessageComponentTypes.ACTION_ROW,
                        components:[
                            {
                                type: MessageComponentTypes.USER_SELECT,
                                custom_id:"requestSplit4_excludeUser",
                                placeholder:"exclude user",
                                min_value:1,
                                max_value:25,
                            }
                        ]
                    }
                ]
            },
        }
    );
}




async function getGuildMembers(guildId: string) {
    const client = DiscordCurator.getFromArchive<Client>("client")
    if (!client) throw Error("there are no client")

    const guild = client.guilds.cache.get(guildId)
    if (!guild) throw Error("there are no guild")

    const guildMembers = await guild.members.fetch()

    return guildMembers
}

function isPresenceMember(member: GuildMember) {
    return member.presence
}

function getRandomMember(options: SplitCommandReturnType): Array<[]> {
    return []
}