import { logger } from "@/infrastructure/providers/loggers/logger";
import mongoose from "mongoose";
import { env } from "@/infrastructure/config/env.config";
export class DatabaseService{
    static async connect(): Promise<void> {
        try {
            const uri = env.MONGO_URL;
    
           if(!uri) throw new Error("Mongo_url is not defined");
            const {connection} = await mongoose.connect(uri,{
                maxPoolSize: 100,
                minPoolSize: 10,
            });
            logger.info("Connected to Mongodb",{
                host:connection.host,
                name: connection.name

            });
        } catch (error) {
            logger.error("Failed to connect to Mongodb",error);
            process.exit(1);
        }
    }
}