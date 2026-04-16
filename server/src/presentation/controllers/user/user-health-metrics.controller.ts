import { CheckHealthMetricsRequestDTO } from "@/application/dto/user/request/get-healthMetrics.dto";
import { SaveHealthMetricsRequestDTO } from "@/application/dto/user/request/user-health-metrics.dto";
import { UserWeightProgressRequestDTO } from "@/application/dto/user/request/user-weight-progress.dto";
import { CheckHealthMetricsResponseDTO } from "@/application/dto/user/response/get-healthMetrics.dto";
import { SaveHealthMetricsResponseDTO } from "@/application/dto/user/response/user-health-metrics.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES, HEALTH_METRICS_MESSAGES } from "@/domain/constants/messages.constants";
import { healthMetricsSchema } from "@/infrastructure/validators/user/onboarding/user-health-metrics.validators";
import { weightUpdateSchema } from "@/infrastructure/validators/user/weight-update.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";



export class HealthMetricsController {
    constructor(
        private readonly _saveHealthMetricsUseCase: IBaseUseCase<SaveHealthMetricsRequestDTO, SaveHealthMetricsResponseDTO>,
        private readonly _checkHealthMetricsUseCase: IBaseUseCase<CheckHealthMetricsRequestDTO, CheckHealthMetricsResponseDTO>,
        private readonly _userWeightProgressUseCase: IBaseUseCase<UserWeightProgressRequestDTO, void>
    ) { }
    async saveMetrics(req: Request, res: Response): Promise<Response> {
        const validData = healthMetricsSchema.parse({
            ...req.body,
            userId: req.user?.userId
        });
        const result = await this._saveHealthMetricsUseCase.execute(validData);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result,HEALTH_METRICS_MESSAGES.HEALTH_METRICS_SAVED));
    }
    async checkHealthMetrics(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.USER_NOT_FOUND));
        }
        const dto = new CheckHealthMetricsRequestDTO({ userId });
        const result = await this._checkHealthMetricsUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
    async updateWeeklyProgress(req: Request, res: Response): Promise<Response> {
        const validation = weightUpdateSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.USER_NOT_FOUND));
        }
        const dto = new UserWeightProgressRequestDTO({
            userId: userId,
            weight: validation.weight
        });
     const result =  await this._userWeightProgressUseCase.execute(dto);
        return res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(result, HEALTH_METRICS_MESSAGES.WEIGHT_PROGRESS_UPDATED));
    
    }

}