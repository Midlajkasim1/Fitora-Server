import { CreateReportRequestDTO } from "@/application/dto/report/request/create-report.dto";
import { ReportResponseDTO } from "@/application/dto/report/response/report-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";

export class ReportController {
    constructor(
        private readonly _createReportUseCase: IBaseUseCase<CreateReportRequestDTO, ReportResponseDTO>
    ) {}

    async createReport(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }

        const { reportedId, type, description } = req.body;
        
        try {
            const result = await this._createReportUseCase.execute({
                reporterId: userId,
                reportedId,
                type,
                description
            });
            return res.status(HttpStatus.CREATED).json(ApiResponse.success(result, "Report filed successfully"));
        } catch (error: unknown) {
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error(error.message));
        }
    }
}
