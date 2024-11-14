import { Request, Response } from "express";
import ResponseStrategy from "./ResponseStrategy";

abstract class InteractionResponseStrategy extends ResponseStrategy{
    
    async execute(req:Request,res:Response,action:ResponseStrategyActionType){
        if (action === ResponseStrategyActionType.Command){
            await this.handleCommand(req,res)
        } else if (action === ResponseStrategyActionType.Message){
            await this.handleMessage(req,res)
        } else {
            throw Error(`Invalid action type for ${this.constructor.name}`)
        }
    }

    abstract handleCommand<T>(req:Request, res:Response, data?:T): void | Promise<void>
    abstract handleMessage<T>(req:Request,res:Response, data?:T):void | Promise<void>
}

export default InteractionResponseStrategy

export const enum ResponseStrategyActionType{
    Message,
    Command
}