import { GetSubscriptionRequestDTO } from "@/application/dto/subscription/request/get-subscription.dto";
import { GetSubscriptionByIdRequestDTO } from "@/application/dto/subscription/request/get-subscriptionById.dto";
import { GetSubscriptionResponseDTO } from "@/application/dto/subscription/response/get-subscription.dto";
import { GetSubscriptionByIdResponseDTO } from "@/application/dto/subscription/response/get-subscriptionById.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { Request, Response } from "express";




export class UserSubscriptionController{
    constructor(
        private readonly _getSubscriptionUseCase:IBaseUseCase<GetSubscriptionRequestDTO,GetSubscriptionResponseDTO>,
        private readonly _getSubscriptionByIdUseCase: IBaseUseCase<GetSubscriptionByIdRequestDTO,GetSubscriptionByIdResponseDTO>
    ){}
    async getUserSubscription(req:Request,res:Response):Promise<Response>{
     const dto:GetSubscriptionRequestDTO={
     page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status: SubscriptionStatus.ACTIVE,        
     };
     const result = await this._getSubscriptionUseCase.execute(dto);
     return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
    }

    async getPlanDetails(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const result = await this._getSubscriptionByIdUseCase.execute({ id });
    
    return res.status(HttpStatus.OK).json({
      success: true,
      data: result,
    });
  }

}