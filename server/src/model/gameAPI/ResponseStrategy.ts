import { Request, Response } from "express";


export default abstract class ResponseStrategy{
    abstract execute(req:Request, res:Response ,...args:any[]):Promise<void> | void
}