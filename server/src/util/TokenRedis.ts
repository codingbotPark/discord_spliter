import { createClient, RedisClientType } from "redis";

class TokenRedis {
    private static instance: TokenRedis;
    private redisClient: RedisClientType;
    private isConnected: boolean = false;  // 연결 상태 체크

    // 생성자에서 Redis 클라이언트 생성
    private constructor() {
        this.redisClient = createClient();
    }

    // 싱글톤 인스턴스 반환
    public static getInstance(): TokenRedis {
        if (!TokenRedis.instance) {
            TokenRedis.instance = new TokenRedis();
        }
        return TokenRedis.instance;
    }

    // Redis에 한 번만 연결
    private async connect(): Promise<void> {
        if (!this.isConnected) {  // 연결이 안 되어 있을 때만 연결
            try {
                await this.redisClient.connect();
                this.isConnected = true;
                console.log('Connected to Redis');
            } catch (error) {
                console.error('Failed to connect to Redis:', error);
            }
        }
    }

    // 토큰 저장
    public async storeToken(userId: string, token: string, expiration: number = 3600): Promise<void> {
        try {
            await this.redisClient.set(`user:${userId}:token`, token, { EX: expiration });
            console.log('Token stored successfully');
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    }

    // 토큰 조회
    public async fetchToken(userId: string): Promise<string | null> {
        try {
            const token = await this.redisClient.get(`user:${userId}:token`);
            if (!token) {
                console.log('No token found');
                return null;
            }
            return token;
        } catch (error) {
            console.error('Failed to fetch token:', error);
            return null;
        }
    }

    // Redis 연결 종료
    public async disconnect(): Promise<void> {
        try {
            if (this.isConnected) {
                await this.redisClient.quit();
                this.isConnected = false;
                console.log('Redis client disconnected');
            }
        } catch (error) {
            console.error('Failed to disconnect Redis:', error);
        }
    }
}

export default TokenRedis;