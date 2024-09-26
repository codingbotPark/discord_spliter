import { RequestHandler } from "express";
import CommandOption, { ApplicationCommandOption } from "../CommandOption/CommandOption.ts";

// command class role = have execution with name
class Command implements ChatInputApplicationCommandData {
    name:string
    description:string
    execution: RequestHandler
    options:CommandOption[] | undefined;
    defaultPermission: boolean | undefined
    type: number | undefined

    constructor({ name, description, options, defaultPermission, type, execution }: ChatInputApplicationCommandData & {execution:RequestHandler}) {
        this.name = name
        this.description = description
        this.options = options
        this.defaultPermission = defaultPermission
        this.type = type
        this.execution = execution
    }
}

// interface for command (similar with discordjs ChatInputApplicationCommandData)
export interface ChatInputApplicationCommandData {
    name: string;
    description: string;
    options?: ApplicationCommandOption[];
    defaultPermission?: boolean;
    type?: number;
}

export default Command