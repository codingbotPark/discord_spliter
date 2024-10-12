export default class Singleton {
    private static instance: Singleton;

    // use constructor only in Singleton
    private constructor() {}

    public static getInstance(): Singleton {
        if (!Singleton.instance) {
            Singleton.instance = new Singleton();
        }
        return Singleton.instance;
    }
}