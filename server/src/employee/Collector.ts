import Employee from "./Employee.ts"


abstract class Collector<Category, Equipment> extends Employee{
    protected collection:Category[] = []
    protected equipment:Equipment

    constructor(equipment:Equipment){
        super()
        this.equipment = equipment
    }

    /** @THINK return this or set void */
    abstract collect():this

    getCollection():Category[]{
        return this.collection
    }
    
    protected addItemToCollection(item:Category){
        this.collection.push(item)
    }
    
}

export default Collector