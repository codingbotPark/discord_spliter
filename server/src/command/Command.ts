
// command class role = have execution with name
class Command{
    private name:string
    private description:string | undefined
    private execution:Function

    constructor(name:string, description:string | undefined, execution:Function){
        this.name = name
        this.description = description
        this.execution = execution
    }
}

export default Command