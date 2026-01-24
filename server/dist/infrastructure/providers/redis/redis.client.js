"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const logger_1 = require("../loggers/logger");
exports.redisClient = new ioredis_1.default(process.env.REDIS_URL || "redis://127.0.0.1:6379");
exports.redisClient.on("connect", () => {
    logger_1.logger.info("Redis connected");
});
exports.redisClient.on("error", (err) => {
    logger_1.logger.error("Redis error", err);
});
