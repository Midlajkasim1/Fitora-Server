"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisOtpStore = void 0;
const redis_client_1 = require("./redis.client");
class RedisOtpStore {
    async save(key, value, ttlSeconds) {
        await redis_client_1.redisClient.set(key, JSON.stringify(value), "EX", ttlSeconds);
    }
    async get(key) {
        const data = await redis_client_1.redisClient.get(key);
        return data ? JSON.parse(data) : null;
    }
    async delete(key) {
        await redis_client_1.redisClient.del(key);
    }
}
exports.RedisOtpStore = RedisOtpStore;
