import { Request, Response } from "express";
import ResponseExec from "./ResponseExec";

abstract class InteractionReponseExec extends ResponseExec{

    
    execute(req:Request,res:Response,action:ResponseExecActionType, ...data:any[]){
        if (action === ResponseExecActionType.Interact){
            this.handleInteract(req,res)
        } else if (action === ResponseExecActionType.Menu){
            this.handleMenu(req,res)
        } else {
            throw Error("Invalid action type for InteractionReponseExec")
        }
    }

    abstract handleInteract(req:Request, res:Response): void | Promise<void>
    abstract handleMenu(req:Request,res:Response):void | Promise<void>
}

export default InteractionReponseExec

export const enum ResponseExecActionType{
    Menu,
    Interact
}