import Employee from "./Employee.ts"


abstract class Collector<Category, Equipment> extends Employee{
    protected collection:Category[] = []
    protected equipment:Equipment

    constructor(equipment:Equipment){
        super()
        this.equipment = equipment
    }

    abstract collect(archives?:Object):this

    getCollection():Category[]{
        return this.collection
    }
    
    protected addItemToCollection(item:Category){
        this.collection.push(item)
    }
    
}

export default Collector