import { DatabaseService } from "@/infrastructure/database/mongoose/connect.db";
import app from "./app";
import "dotenv/config";
import { env } from "@/infrastructure/config/env.config";
import { logger } from "@/infrastructure/providers/loggers/logger";
import { initSlotWorker } from "@/infrastructure/database/queue/slot-worker";
import { trainerRepositories } from "@/infrastructure/di/trainer/trainer.repositories";
const PORT = env.PORT || 4000;

const startServer = async ()=>{
    await DatabaseService.connect();
    initSlotWorker(trainerRepositories.slotRepository);
    app.listen(PORT,()=>{
        logger.info(`Server started on http://localhost:${PORT}`);
    });
};
startServer();