export default class Singleton {
    protected static instance: Singleton;

    protected constructor() {
        // 자식 클래스에서 직접 호출되지 않도록 protected로 설정
    }

    public static getInstance() {
        // this를 Singleton의 자식 클래스 타입으로 변경
        return this.instance || (this.instance = new this());
    }
}