import { Request, Response } from "express";
import GameAPI from "../GameAPI.ts";


class ValorantGameAPI implements GameAPI{
    splitWithMatch(req: Request, res: Response): boolean {
        return true
    }
}

export default ValorantGameAPI