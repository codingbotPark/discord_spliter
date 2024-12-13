import {  APIEmbed, EmbedBuilder, EmbedData } from "discord.js";
import GameAPI, { SplitStrategies } from "../../../../gameAPI/GameAPI.ts";
import SplitWithTier from "../../../../core/strategy/SplitWithTier.ts";


class OverwatchSplitAPI extends GameAPI{
    mainColor: number = 0xF06414;
    basicEmbed: APIEmbed = new EmbedBuilder()
    .setColor(this.mainColor)
    .setTitle("overwatch players")
    .data
}
const overwatchSplitAPI = new OverwatchSplitAPI()
overwatchSplitAPI.registerAction(SplitStrategies.SplitWithTier, new SplitWithTier(overwatchSplitAPI))

export default overwatchSplitAPI


export type OverwatchRanks = "unknown" | "bronze" | "silver" | "gold" | "platinum" | "diamond" | "Master" | "Grandmaster" | "Top"
export const enum OverwatchPositions {
    Tank = "tank",
    Offense = "offense",
    Support = "support",
    Open = "open",
    Unknown = "unknown"
}
export const overwatchRankKind:Record<OverwatchRanks, {priority:number}> = {
    "unknown":{priority:0},
    "bronze":{priority:1},
    "silver":{priority:2},
    "gold":{priority:3},
    "platinum":{priority:5},
    "diamond":{priority:7},
    "Master":{priority:9},
    "Grandmaster":{priority:11},
    "Top":{priority:13},
} 