import GameAPI, { SplitStrategies } from "../GameAPI.ts";
import SplitWithTier from "./SplitWithTier.ts";


class OverwatchSplitAPI extends GameAPI{
    constructor(){
        super()
    }
}
const overwatchSplitAPI = new OverwatchSplitAPI()
overwatchSplitAPI.registerAction(SplitStrategies.SplitWithTier, new SplitWithTier())

export default overwatchSplitAPI