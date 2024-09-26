import Archive from "../archive/Archive.ts";
import Employee from "./Employee.ts"

// curator class role = archiving for preparing data or caching data
export default abstract class Curator<ArchiveType extends Archive> extends Employee{
    abstract setupArchive():this

    private archivePlanList:Array<{key:string,plan:Promise<any>}> = []
    private archive:ArchiveType

    constructor(archive:ArchiveType){
        super()
        this.archive = archive
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
                this.archive.addData(key, result)
            })
        } catch (err) {
            throw new Error(String(err));
        }

        return this
    }

    getFromArchive(key: string): any | undefined {
        return this.archive.getData(key);
    }

}