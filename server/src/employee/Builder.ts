import Employee from "./Employee";


abstract class Builder<Building> extends Employee{
    private building:Partial<Building> = {};
    
    set<K extends keyof Building>(key:K, value:Building[K]):this{
        this.building[key] = value
        return this
    }

    abstract build():Building
}

export default Builder