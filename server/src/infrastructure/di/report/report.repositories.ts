import { MongooseReportRepository } from "@/infrastructure/database/repositories/report.repository";

export const reportRepositories = {
    reportRepository: new MongooseReportRepository()
};
