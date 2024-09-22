import Command from "../class/Command.ts";
import CommandBuilder from "../CommandBuilder";


abstract class CommandHub{
    protected commandBuilder:CommandBuilder
    constructor(builder:CommandBuilder){
        this.commandBuilder = builder
    }

    protected commands:Command[] = []

    abstract setCommands():void

    getCommands():Command[]{
        return this.commands
    }

    protected addCommand(command:Command){
        this.commands.push(command)
    }
}

export default CommandHub