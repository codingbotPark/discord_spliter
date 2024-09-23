export default abstract class Employee{
    constructor(needLog:boolean = true){
        if (needLog){
            // logging created
        }
    }
    fired(){console.log(this.constructor.name + " fired")}
}

