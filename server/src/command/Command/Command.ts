import { RequestHandler } from "express";
import CommandOption, { ApplicationCommandOption } from "./CommandOption/CommandOption";

// command class role = have execution with name
class Command implements ChatInputApplicationCommandData {
    name:string
    description:string
    options:CommandOption[] | undefined;
    defaultPermission: boolean | undefined
    type: number | undefined

    constructor({ name, description, options, defaultPermission, type }: ChatInputApplicationCommandData) {
        this.name = name
        this.description = description
        this.options = options
        this.defaultPermission = defaultPermission
        this.type = type
    }
}
export default Command

// interface for command (similar with discordjs ChatInputApplicationCommandData)
export interface ChatInputApplicationCommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    defaultPermission?: boolean;
    type?: number;
}
