import { CreateSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/create-subscriptionPlan.dto";
import { GetSubscriptionPlanByIdRequestDTO } from "@/application/dto/subscription/request/get-subscriptionByIdPlan.dto";
import { GetSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/get-subscriptionPlan.dto";
import { UpdateSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/update-subscriptionPlan.dto";
import { UpdateSubscriptionPlanStatusRequestDTO } from "@/application/dto/subscription/request/updateStatus-subscriptionPlan.dto";
import { CreateSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/create-subscriptionPlan.dto";
import { GetSubscriptionPlanByIdResponseDTO } from "@/application/dto/subscription/response/get-subscriptionById.dto";
import { GetSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/get-subscriptionPlan.dto";
import { UpdateSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/update-subscriptionPlan.dto";
import { UpdateSubscriptionPlanStatusResponseDTO } from "@/application/dto/subscription/response/updateStatus-subscriptionPlan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";
import { SubscriptionSchema } from "@/infrastructure/validators/admin/subscription.validators";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";




export class AdminSubscriptionController {
    constructor(
        private readonly _createSubscriptionUseCase: IBaseUseCase<CreateSubscriptionPlanRequestDTO, CreateSubscriptionPlanResponseDTO>,
        private readonly _getSubscriptionUseCase: IBaseUseCase<GetSubscriptionPlanRequestDTO, GetSubscriptionPlanResponseDTO>,
        private readonly _updateSubscriptionUseCase: IBaseUseCase<UpdateSubscriptionPlanRequestDTO, UpdateSubscriptionPlanResponseDTO>,
        private readonly _updateSubscriptionStatus: IBaseUseCase<UpdateSubscriptionPlanStatusRequestDTO, UpdateSubscriptionPlanStatusResponseDTO>,
        private readonly _getSubscriptionByIdUseCase: IBaseUseCase<GetSubscriptionPlanByIdRequestDTO, GetSubscriptionPlanByIdResponseDTO>
    ) { }
    async createSubscripionPlan(req: Request, res: Response): Promise<Response> {
        const dto = SubscriptionSchema.parse(req.body);
        const result = await this._createSubscriptionUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
    async getSubscriptionPlan(req: Request, res: Response): Promise<Response> {
        const dto: GetSubscriptionPlanRequestDTO = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search as string,
            status: req.query.status as SubscriptionPlanStatus.ACTIVE | SubscriptionPlanStatus.INACTIVE | undefined
        };
        const result = await this._getSubscriptionUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
    async updateSubscriptionPlan(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const dto = SubscriptionSchema.parse(req.body);
        const result = await this._updateSubscriptionUseCase.execute({ id, ...dto });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result, SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_UPDATED));
    }
    async updateSubscriptionPlanStatus(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const result = await this._updateSubscriptionStatus.execute({ id });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result, SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_STATUS_UPDATED));
    }
    async getSubscriptionPlanById(req: Request, res: Response): Promise<Response> {
        const id = req.params.id;
        const result = await this._getSubscriptionByIdUseCase.execute({ id });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
}