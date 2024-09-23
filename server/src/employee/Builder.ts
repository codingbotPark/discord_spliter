import Employee from "./Employee";


abstract class Builder<Building, ReturnType = Building> extends Employee{
    protected building:Partial<Building> = {};
    
    set<K extends keyof Building>(key:K, value:Building[K]):this{
        this.building[key] = value
        return this
    }

    abstract build():ReturnType; 
}

export default Builder