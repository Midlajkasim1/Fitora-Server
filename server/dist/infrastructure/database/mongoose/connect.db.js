"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseService = void 0;
const logger_1 = require("@/infrastructure/providers/loggers/logger");
const mongoose_1 = __importDefault(require("mongoose"));
class DatabaseService {
    static async connect() {
        try {
            const uri = process.env.MONGO_URL;
            if (!uri)
                throw new Error("Mongo_url is not defined");
            const { connection } = await mongoose_1.default.connect(uri, {
                maxPoolSize: 100,
                minPoolSize: 10,
            });
            logger_1.logger.info('Connected to Mongodb', {
                host: connection.host,
                name: connection.name
            });
        }
        catch (error) {
            logger_1.logger.error('Failed to connect to Mongodb', error);
            process.exit(1);
        }
    }
}
exports.DatabaseService = DatabaseService;
