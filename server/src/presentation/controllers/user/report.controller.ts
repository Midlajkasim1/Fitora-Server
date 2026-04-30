import { CreateReportRequestDTO } from "@/application/dto/report/request/create-report.dto";
import { CreateReportResponseDTO } from "@/application/dto/report/response/create-report-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES, REPORT_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";

export class ReportController {
    constructor(
        private readonly _createReportUseCase: IBaseUseCase<CreateReportRequestDTO, CreateReportResponseDTO>
    ) {}

    async createReport(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { reportedId, type, description, sessionId } = req.body;
        
        try {
            const result = await this._createReportUseCase.execute({
                reporterId: userId,
                reportedId,
                type,
                description,
                sessionId
            });
            return res.status(HttpStatus.CREATED).json(ApiResponse.success(result, REPORT_MESSAGES.REPORT_FILED));
        } catch (error: unknown) {
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error((error as Error).message));
        }
    }
}
