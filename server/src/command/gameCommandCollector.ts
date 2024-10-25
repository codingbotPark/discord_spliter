import Collector from "../employee/Collector.ts";
import gameAPI, { gameNameShortCut } from "../gameAPI/index.ts";
import GameAPI, { apiNameMap } from "../gameAPI/GameAPI.ts";
import Command from "./Command/Command.ts";
import CommandBuilder from "./Command/CommandBuilder.ts";
import CommandOption, { ChoicesType } from "./Command/CommandOption/CommandOption.ts";



class gameCommandCollector extends Collector<Command, CommandBuilder> {
    collect(): void {
        // set refer gameAPI
        const games = Object.entries(gameAPI)
        games.forEach(([gameName, gameAPIInstance]: [string, GameAPI]) => {

            const splitMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(gameAPIInstance))

            const splitMethodChoices = splitMethods.reduce((choiceArr: ChoicesType, curr) => {
                // filter api that registered in apiNameMap
                if (apiNameMap.hasOwnProperty(curr)) {
                    choiceArr.push({
                        name: apiNameMap[curr],
                        value: curr
                    })
                }
                return choiceArr
            }, [])

            this.addItemToCollection(
                this.equipment
                .set("name", gameName)
                .set("description", `commands for ${gameNameShortCut[gameName] ?? gameName}`)
                .set("type", 1)
                .set("options", [
                    new CommandOption({
                        name: "using",
                        description: "game for using api",
                        type: 3,
                        choices: splitMethodChoices,
                    })
                ])
                .build()
            )
        })
    }
}

export default gameCommandCollector


export interface gameCommandOption{
    using?:keyof GameAPI
}