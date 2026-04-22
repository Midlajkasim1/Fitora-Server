import { ReportController } from "@/presentation/controllers/user/report.controller";
import { reportUseCases } from "./report.usecases";

export const reportControllers = {
    reportController: new ReportController(
        reportUseCases.createReportUseCase
    )
};
