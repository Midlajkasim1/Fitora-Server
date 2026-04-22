import { CreateReportUseCase } from "@/application/usecases/report/create-report.usecase";
import { reportRepositories } from "./report.repositories";
import { trainerRepositories } from "../trainer/trainer.repositories";

export const reportUseCases = {
    createReportUseCase: new CreateReportUseCase(
        reportRepositories.reportRepository,
        trainerRepositories.slotRepository
    )
};
