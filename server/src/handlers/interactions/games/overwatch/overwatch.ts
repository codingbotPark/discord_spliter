import {  APIEmbed, EmbedBuilder, EmbedData } from "discord.js";
import GameAPI, { SplitStrategies } from "../../../../gameAPI/GameAPI.ts";
import SplitWithTier from "../../../../core/strategy/SplitWithProfile.ts";
import OverwatchSplitWithTier from "./OverwatchSplitWithProfile.ts";
import RankSystem from "../../../../core/system/RankSystem.ts";


export class OverwatchSplitAPI extends GameAPI{
    mainColor: number = 0xF06414;
    gameName: string = "overwatch"
    basicEmbed: APIEmbed = new EmbedBuilder()
    .setColor(this.mainColor)
    .setTitle(`${this.gameName} players`)
    .data
    rankSystem = new RankSystem({
        "Unknown":{priority:0},
        "Bronze":{priority:1},
        "Silver":{priority:2},
        "Gold":{priority:3},
        "Platinum":{priority:5},
        "Diamond":{priority:7},
        "Master":{priority:9},
        "Grandmaster":{priority:11},
        "Top":{priority:13},
    } as Record<OverwatchRanks, {priority:number}>)
}
const overwatchSplitAPI = new OverwatchSplitAPI()
overwatchSplitAPI.registerAction(SplitStrategies.SplitWithTier, new OverwatchSplitWithTier(overwatchSplitAPI))

export default overwatchSplitAPI


export type OverwatchRanks = "Unknown" | "Bronze" | "Silver" | "Gold" | "Platinum" | "Diamond" | "Master" | "Grandmaster" | "Top"
export const enum OverwatchPositions {
    Tank = "tank",
    Offense = "offense",
    Support = "support",
    Open = "open",
    Unknown = "unknown"
}