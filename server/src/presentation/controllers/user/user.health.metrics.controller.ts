import { CheckHealthMetricsRequestDTO } from "@/application/dto/user/request/get.health.metrics.dto";
import { UserWeightProgressRequestDTO } from "@/application/dto/user/request/user-weight-progress.dto";
import { SaveHealthMetricsRequestDTO } from "@/application/dto/user/request/user.health.metrics.dto";
import { CheckHealthMetricsResponseDTO } from "@/application/dto/user/response/get.health.metrics.dto";
import { SaveHealthMetricsResponseDTO } from "@/application/dto/user/response/user.health.metrics.dto";
import { IBaseUseCase } from "@/application/interfaces/base.usecase.interface";
import { HttpStatus } from "@/domain/constants/http.status.constants";
import { AUTH_MESSAGES, HEALTH_METRICS_MESSAGES } from "@/domain/constants/messages.constants";
import { healthMetricsSchema } from "@/infrastructure/validators/user/onboarding/user-health-metrics.validators";
import { weightUpdateSchema } from "@/infrastructure/validators/user/weight-update.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";
import { ForbiddenError } from "@/shared/errors/forbidden.error";



export class HealthMetricsController {
    constructor(
        private readonly _saveHealthMetricsUseCase: IBaseUseCase<SaveHealthMetricsRequestDTO, SaveHealthMetricsResponseDTO>,
        private readonly _checkHealthMetricsUseCase: IBaseUseCase<CheckHealthMetricsRequestDTO, CheckHealthMetricsResponseDTO>,
        private readonly _userWeightProgressUseCase: IBaseUseCase<UserWeightProgressRequestDTO, void>
    ) { }
    async saveMetrics(req: Request, res: Response): Promise<Response> {
        const authenticatedSessionId = req.user?.id;
        const targetUserId = req.body?.userId || req.body?.id || req.query?.userId || req.query?.id || req.params?.userId || req.params?.id || authenticatedSessionId;
        if (targetUserId !== authenticatedSessionId) {
            throw new ForbiddenError("You are not authorized to save metrics for this user.");
        }
        const validData = healthMetricsSchema.parse({
            ...req.body,
            userId: authenticatedSessionId
        });
        const result = await this._saveHealthMetricsUseCase.execute(validData);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result,HEALTH_METRICS_MESSAGES.HEALTH_METRICS_SAVED));
    }
    async checkHealthMetrics(req: Request, res: Response): Promise<Response> {
        const authenticatedSessionId = req.user?.id;
        if (!authenticatedSessionId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.USER_NOT_FOUND));
        }
        const targetUserId = req.body?.userId || req.body?.id || req.query?.userId || req.query?.id || req.params?.userId || req.params?.id || authenticatedSessionId;
        if (targetUserId !== authenticatedSessionId) {
            throw new ForbiddenError("You are not authorized to check metrics for this user.");
        }
        const dto = new CheckHealthMetricsRequestDTO({ userId: authenticatedSessionId });
        const result = await this._checkHealthMetricsUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
    async updateWeeklyProgress(req: Request, res: Response): Promise<Response> {
        const validation = weightUpdateSchema.parse(req.body);
        const authenticatedSessionId = req.user?.id;
        if (!authenticatedSessionId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.USER_NOT_FOUND));
        }
        const targetUserId = req.body?.userId || req.body?.id || req.query?.userId || req.query?.id || req.params?.userId || req.params?.id || authenticatedSessionId;
        if (targetUserId !== authenticatedSessionId) {
            throw new ForbiddenError("You are not authorized to update weekly progress for this user.");
        }
        const dto = new UserWeightProgressRequestDTO({
            userId: authenticatedSessionId,
            weight: validation.weight
        });
     const result =  await this._userWeightProgressUseCase.execute(dto);
        return res
            .status(HttpStatus.OK)
            .json(ApiResponse.success(result, HEALTH_METRICS_MESSAGES.WEIGHT_PROGRESS_UPDATED));
    
    }

}
