import { CreateSubscriptionRequestDTO } from "@/application/dto/subscription/request/create-subscription.dto";
import { GetSubscriptionRequestDTO } from "@/application/dto/subscription/request/get-subscription.dto";
import { GetSubscriptionByIdRequestDTO } from "@/application/dto/subscription/request/get-subscriptionById.dto";
import { UpdateSubscriptionRequestDTO } from "@/application/dto/subscription/request/update-subscription.dto";
import { UpdateSubscriptionStatusRequestDTO } from "@/application/dto/subscription/request/updateStatus-subscription.dto";
import { CreateSubscriptionResponseDTO } from "@/application/dto/subscription/response/create-subscription.dto";
import { GetSubscriptionResponseDTO } from "@/application/dto/subscription/response/get-subscription.dto";
import { GetSubscriptionByIdResponseDTO } from "@/application/dto/subscription/response/get-subscriptionById.dto";
import { UpdateSubscriptionResponseDTO } from "@/application/dto/subscription/response/update-subscription.dto";
import { UpdateSubscriptionStatusResponseDTO } from "@/application/dto/subscription/response/updateStatus-subscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { SubscriptionSchema } from "@/infrastructure/validators/admin/subscription.validators";
import { Request, Response } from "express";




export class AdminSubscriptionController {
    constructor(
        private readonly _createSubscriptionUseCase:IBaseUseCase<CreateSubscriptionRequestDTO,CreateSubscriptionResponseDTO>,
        private readonly _getSubscriptionUseCase:IBaseUseCase<GetSubscriptionRequestDTO,GetSubscriptionResponseDTO>,
        private readonly _updateSubscriptionUseCase:IBaseUseCase<UpdateSubscriptionRequestDTO,UpdateSubscriptionResponseDTO>,
        private readonly _updateSubscriptionStatus:IBaseUseCase<UpdateSubscriptionStatusRequestDTO,UpdateSubscriptionStatusResponseDTO>,
        private readonly _getSubscriptionByIdUseCase:IBaseUseCase<GetSubscriptionByIdRequestDTO,GetSubscriptionByIdResponseDTO>
    ){}
    async createSubscripion(req:Request,res:Response):Promise<Response>{
        const dto = SubscriptionSchema.parse(req.body);
        const result = await this._createSubscriptionUseCase.execute(dto);
        return res.status(HttpStatus.OK).json({
            success:true,
            data:result
        });
    }
    async getSubscription(req:Request,res:Response):Promise<Response>{
        const dto:GetSubscriptionRequestDTO={
            page:Number(req.query.page)||1,
            limit:Number(req.query.limit)||10,
            search:req.query.search as string,
            status:req.query.status as SubscriptionStatus.ACTIVE | SubscriptionStatus.INACTIVE | undefined 
        };
        const result = await this._getSubscriptionUseCase.execute(dto);
        return res.status(HttpStatus.OK).json({
            success:true,
            data:result

        });
    }
    async updateSubscription(req:Request,res:Response):Promise<Response>{
    const id = req.params.id;
    const dto = SubscriptionSchema.parse(req.body);
    const result = await this._updateSubscriptionUseCase.execute({id,...dto});
    return res.status(HttpStatus.OK).json({
        success:true,
        data:result
    });
    }
    async updateSubscriptionStatus(req:Request,res:Response):Promise<Response>{
    const id = req.params.id;
    await this._updateSubscriptionStatus.execute({id});
    return res.status(HttpStatus.OK).json({
        success:true,
        message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_PLAN_STATUS_UPDATED
    });
    }
    async getSubscriptionById(req:Request,res:Response):Promise<Response>{
        const id = req.params.id;
        const result = await this._getSubscriptionByIdUseCase.execute({id});
        return res.status(HttpStatus.OK).json({
            sucess:true,
            data:result
        });
    }
}