import { Request, Response } from "express";


export default abstract class ResponseExec{
    abstract execute(req:Request, res:Response ,...args:any[]):Promise<void> | void
}