import { createClient, RedisClientType } from "redis";

class TokenRedis{
    private static redisClient:RedisClientType = createClient();

    public async storeToken(userId: string, token: string, expiration: number = 3600): Promise<void> {
        try {
            await TokenRedis.redisClient.set(`user:${userId}:token`, token, { EX: expiration });
            console.log('Token stored successfully');
        } catch (error) {
            console.error('Failed to store token:', error);
        }
    }

    public async getToken(userId: string): Promise<string | null> {
        try {
            const token = await TokenRedis.redisClient.get(`user:${userId}:token`);
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

    public async disconnect(): Promise<void> {
        await TokenRedis.redisClient.quit();
        console.log('Redis client disconnected');
    }
}

export default TokenRedis