import GameAPI, { SplitStrategies } from "../GameAPI.ts";
import SplitWithTier from "./SplitWithTier.ts";


class OverwatchSplitAPI extends GameAPI{
    constructor(){
        super()
        this.registerAction(SplitStrategies.SplitWithTier, new SplitWithTier())
    }
}
const overwatchSplitAPI = new OverwatchSplitAPI()

export default overwatchSplitAPI