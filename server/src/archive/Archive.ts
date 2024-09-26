

// Archive class role = caching data(include fetching) for using for collector
// using singleton pattern
export default class Archive{
    private static instance:Archive

    /**@TODO search way to extend value type with key */
    private archiveData:Map<string, any>

    protected constructor(){
        this.archiveData = new Map<string, any>()
    }

    public static getInstance() {
        // this를 Singleton의 자식 클래스 타입으로 변경
        return this.instance || (this.instance = new this());
    }

    // Method to add data to the archive
    public addData(key: string, value: any): void {
        this.archiveData.set(key, value);
    }

    // Method to retrieve data from the archive
    public getData<ValueType = any>(key: string): ValueType | undefined {
        return this.archiveData.get(key);
    }

    // Method to clear all data in the archive
    public clearArchive(): void {
        this.archiveData.clear();
    }
}
