
// index 0 = channel 1 ...

import { Request, Response } from "express";
import ResponseStrategy from "../model/gameAPI/ResponseStrategy";
import { ResponseStrategyActionType } from "../model/gameAPI/InteractionResponseExec";

// string = discord user id

abstract class GameAPI{
    private strategy: Map<SplitStrategies, ResponseStrategy> = new Map();

    // 행동 전략을 등록하는 메서드
    registerAction(strategyName: SplitStrategies, strategy: ResponseStrategy) {
        this.strategy.set(strategyName, strategy);
    }

    // 등록된 행동을 실행하는 메서드
    executeAction(req:Request, res:Response) {

        const {strategyName, action}:ReqActionData = req.body.action
        // req 객체에 추가된 strategyName 과 action

        if (!strategyName || (action === undefined)){
            throw Error("cannot get action data from body")
        }
        
        const strategy = this.strategy.get(strategyName);
        if (!strategy) {
            throw Error(`Action ${strategyName} is not registered.`);
        }
        strategy.execute(req, res, action);
    }

    isInStrategy(strategyName:string){
        if (strategyName in SplitStrategies){
            return this.strategy.has(strategyName as SplitStrategies)
        }
        return false
    }

    getStrategiesEntry(){
        return Array.from(this.strategy.entries())
    }
}


export default GameAPI

export enum SplitStrategies{
    SplitWithTier="splitWithTier",
    SplitWithMatch="splitWithMatch"
}

// map for using in user command
export const strategyNameMap:Record<SplitStrategies, string> = {
    "splitWithMatch":"matched member",
    "splitWithTier":"tier, proficiency"
}

export type ReqActionData = {strategyName:SplitStrategies, action:ResponseStrategyActionType}

