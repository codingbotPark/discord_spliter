import Archive from "../archive/Archive.ts";
import Employee from "./Employee.ts"

// curator class role = archiving for preparing data or caching data
export default abstract class Curator extends Employee{
    abstract setupArchive():this

    private archivePlanList:Array<{key:string,plan:Promise<any>}> = []
    private static archive:Archive

    constructor(archive:Archive){
        super()
        Curator.archive = archive
    }

    protected addArchivePlan(key:string, plan:Promise<any>){
        this.archivePlanList.push({key, plan})
    }

    async executeArchivePlan():Promise<this>{
        const archivePromises = this.archivePlanList.map(item => item.plan);
        try{
            const results = await Promise.all(archivePromises)
            results.forEach((result, idx) => {
                const key = this.archivePlanList[idx].key
                Curator.addToArchive(key, result)
            })
        } catch (err) {
            throw new Error(String(err));
        }

        return this
    }

    static addToArchive(key:string,value:any){
        Curator.archive.addData(key,value)
    }

    static getFromArchive<ValueType=any>(key: string): ValueType | undefined {
        return Curator.archive.getData(key) as ValueType;
    }

}