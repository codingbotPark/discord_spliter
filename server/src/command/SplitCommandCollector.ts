import Collector from "../employee/Collector.ts";
import { GuildMember, isHumanMember } from "../types/discordGuildMemberObject.type.ts";
import DiscordRequest from "../util/discordRequest.ts";
import { HTTPMethod } from "../util/httpMethod.ts";
import { verifiedEnv } from "../util/verifyEnv.ts";
import Command from "./Command/Command.ts";
import CommandOption, { ChoicesType } from "./CommandOption/CommandOption.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";


class SplitCommandCollector extends Collector<Command, CommandBuilder>{

    private guildMemberChoices:ChoicesType = []

    /** @THINK about communicator & archives for using API */
    async initialize(){
        // to get guild member
        // 0. verify discord app
        // 1. intent guild member (application settings > BOT)
        // 2. add bot to server(guild that you need) with role options
        // ex https://discord.com/oauth2/authorize?client_id=<guildID>&scope=bot&permissions=16778256
        const endPoint = `/guilds/${verifiedEnv.GUILD_ID}/members?limit=1000`

        const guildMembers:GuildMember[] = await DiscordRequest(endPoint, {method:HTTPMethod.GET})
        .then((res) => {return res.json()})
        .catch((err) => {throw Error(err)})

        console.log(guildMembers)
        
        this.guildMemberChoices = guildMembers.filter((discordUser) => isHumanMember(discordUser)).map((discordUser) => ({
            name:discordUser.user.username,
            value:discordUser.user.id
        }))

        return this
    }


    collect():this {
        this.addItemToCollection(
            this.equipment
            .set("name", "split")
            .set("type", 1)
            .set("description", "split void channel")
            .set("execution", () => {
                console.log("test1")
            })
            // name should not include space char
            .set("options",[
                new CommandOption({
                    name:"method",
                    description:"spliting method",
                    type:3,
                    choices:[
                        {
                            name:"game",
                            value:"split with game"
                        },{
                            name:"random",
                            value:"split with randomly"
                        },
                    ]
                }),
                new CommandOption({
                    name: "game",
                    description: "split with game",
                    type: 3,
                    choices:[
                        {
                            name:"Overwatch",
                            value:"1 overwatch"
                        },{
                            name:"league of legends",
                            value:"2 LOL"
                        }
                    ]
                }),
                new CommandOption({
                    name:"channel_number",
                    description:"channel number",
                    min_value:2,
                    max_value:10,
                    type:4
                }),
                new CommandOption({
                    name:"exclude_user",
                    description:"exclude changing member",
                    type:3,
                    choices:this.guildMemberChoices
                })
            ])
            .build()
        )

        this.addItemToCollection(
            new Command({
                type: 1,
                description:"test2",
                name: 'test2',
                execution() {
                    console.log("test2")
                }
            })
        )

        return this
    }
    
}

export default SplitCommandCollector