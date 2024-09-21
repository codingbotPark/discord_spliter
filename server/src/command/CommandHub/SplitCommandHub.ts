import Command from "../Command";
import CommandBuilder from "../CommandBuilder";


class splitCommandHub{
    commandBuilder = new CommandBuilder()
    private commands:Command[] = []

    constructor(){}

    setCommands(){
        this.commandBuilder.setName("test").
    }

    getCommands(){

    }

    addCommand(command:Command){
        this.commands.push(command)
    }
}

export default splitCommandHub