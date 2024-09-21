import Command from "./Command";

// CommandBuilder class role = build command
class CommandBuilder{

    private name:string | undefined
    private description:string | undefined
    private execution:Function | undefined

    clear(){
        this.name = undefined
        this.description = undefined
        this.execution = undefined
    }    

    setName(name:string){
        this.name = name
    }

    setDescription(description:string){
        this.description = description
    }

    setExecution(execution:Function){
        this.execution = execution
    }

    // return Command, after handling exception
    build(){
        if (!this.name){
            return
            // need name
        }
        if (!this.execution){
            return
            // need execution
        }
        return new Command({name:this.name, description:this.description, execution:this.execution})
    }
}


export default CommandBuilder