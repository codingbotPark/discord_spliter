import {  APIEmbed, EmbedBuilder, EmbedData } from "discord.js";
import GameAPI, { SplitStrategies } from "../GameAPI.ts";
import SplitWithTier from "./SplitWithTier.ts";


class OverwatchSplitAPI extends GameAPI{
    mainColor: number = 0xF06414;
    basicEmbed: APIEmbed = new EmbedBuilder()
    .setColor(this.mainColor)
    .setTitle("overwatch players")
    .data
    
    constructor(){
        super()
    }
}
const overwatchSplitAPI = new OverwatchSplitAPI()
overwatchSplitAPI.registerAction(SplitStrategies.SplitWithTier, new SplitWithTier(overwatchSplitAPI))

export default overwatchSplitAPI


export const enum OverwatchPositions {
    Tank = "tank",
    Offense = "offense",
    Support = "support",
    Open = "open",
    Unknown = "unknown"
}