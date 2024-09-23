import Employee from "./Employee"


abstract class Collector<Category, Equipment> extends Employee{
    protected collection:Category[] = []
    protected equipment:Equipment

    constructor(equipment:Equipment){
        super()
        this.equipment = equipment
    }

    abstract collect():void

    getCollection():Category[]{
        return this.collection
    }
    
    protected addItemToCollection(item:Category){
        this.collection.push(item)
    }
    
}

export default Collector