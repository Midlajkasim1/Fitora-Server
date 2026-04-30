import { CancelSubscriptionRequestDTO } from "@/application/dto/subscription/request/cancel-subscription.dto";
import { CheckActiveSubscriptionRequestDTO } from "@/application/dto/subscription/request/check-active-subscriptionUser.dto";
import { GetPurchaseHistoryRequestDTO } from "@/application/dto/subscription/request/get-purchaseHistory.dto";
import { GetSubscriptionPlanByIdRequestDTO } from "@/application/dto/subscription/request/get-subscriptionByIdPlan.dto";
import { GetSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/get-subscriptionPlan.dto";
import { HandleWebhookRequestDTO } from "@/application/dto/subscription/request/handle-webhook.dto";
import { PurchaseSubscriptionRequestDTO } from "@/application/dto/subscription/request/purchase-subscription.dto";
import { CancelSubscriptionResponseDTO } from "@/application/dto/subscription/response/cancel-subscription.dto";
import { ActiveSubscriptionResponseDTO } from "@/application/dto/subscription/response/check-active-subscriptionUser.dto";
import { GetPurchaseHistoryResponseDTO } from "@/application/dto/subscription/response/get-purchaseHistory.dto";
import { GetSubscriptionPlanByIdResponseDTO } from "@/application/dto/subscription/response/get-subscriptionById.dto";
import { GetSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/get-subscriptionPlan.dto";
import { HandleWebhookResponseDTO } from "@/application/dto/subscription/response/handle-webhook.dto";
import { PurchaseSubscriptionResponseDTO } from "@/application/dto/subscription/response/purchaseSubscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";
import { IPaymentProvider } from "@/domain/interfaces/services/paymentProvider.interface";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";




export class UserSubscriptionController{
    constructor(
        private readonly _getSubscriptionUseCase:IBaseUseCase<GetSubscriptionPlanRequestDTO,GetSubscriptionPlanResponseDTO>,
        private readonly _getSubscriptionByIdUseCase: IBaseUseCase<GetSubscriptionPlanByIdRequestDTO,GetSubscriptionPlanByIdResponseDTO>,
        private readonly _purchaseSubscriptionUseCase: IBaseUseCase<PurchaseSubscriptionRequestDTO,PurchaseSubscriptionResponseDTO>,
        private readonly _webhookUseCase:IBaseUseCase<HandleWebhookRequestDTO, HandleWebhookResponseDTO>,
        private readonly _paymentProvider:IPaymentProvider,
        private readonly _checkActiveSubscriptionUserUseCase: IBaseUseCase<CheckActiveSubscriptionRequestDTO,ActiveSubscriptionResponseDTO>,
        private readonly _cancelSubscriptionUseCase : IBaseUseCase<CancelSubscriptionRequestDTO,CancelSubscriptionResponseDTO>,
        private readonly _getPurchaseHistoryUseCase:IBaseUseCase<GetPurchaseHistoryRequestDTO,GetPurchaseHistoryResponseDTO>
    ){}
    async getUserSubscriptionPlan(req:Request,res:Response):Promise<Response>{
     const dto:GetSubscriptionPlanRequestDTO={
     page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status: SubscriptionPlanStatus.ACTIVE,        
     };
     const result = await this._getSubscriptionUseCase.execute(dto);
     return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }

    async getPlanDetails(req: Request, res: Response): Promise<Response> {
    const id = req.params.id;
    const result = await this._getSubscriptionByIdUseCase.execute({ id });
    
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
  async purchasePlan(req:Request,res:Response):Promise<Response>{


       if (!req.user?.userId || !req.user?.email || !req.user?.name) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ApiResponse.error(AUTH_MESSAGES.USER_AUTHENTICATION_NOT_FOUND)
      );
    }


     const dto={
      userId:req.user?.userId,
      userEmail:req.user?.email,
      userName:req.user?.name,
      planId:req.body.planId
    };
    
    const result = await this._purchaseSubscriptionUseCase.execute(dto);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
  async handlewebhook(req:Request,res:Response):Promise<Response>{
    
    const event =  this._paymentProvider.verifyWebhook(req.body,req.headers);
    const dto = new HandleWebhookRequestDTO({
      sessionId:event.sessionId,
      type:event.type,
      metadata:{
        userId:event.metadata?.userId,
        planId:event.metadata?.planId,
      }
    });
    const result = await this._webhookUseCase.execute(dto);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
async checkActiveSubcriptionStatus(req:Request,res:Response):Promise<Response>{
  const userId = req.user?.userId;
if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ApiResponse.error(AUTH_MESSAGES.USER_AUTHENTICATION_NOT_FOUND)
      );
    }
  const result = await this._checkActiveSubscriptionUserUseCase.execute({userId});
  return res.status(HttpStatus.OK).json(ApiResponse.success(result));
}
async CancelSubscription(req:Request,res:Response):Promise<Response>{
  const userId = req.user?.userId;
  if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ApiResponse.error(AUTH_MESSAGES.USER_AUTHENTICATION_NOT_FOUND)
      );
    }
  const dto = new CancelSubscriptionRequestDTO({
    userId:userId!
  });
  const result = await this._cancelSubscriptionUseCase.execute(dto);
  return res.status(HttpStatus.OK).json(ApiResponse.success(result));
}
async getPurchaseHistory(req:Request,res:Response):Promise<Response>{
   const userId = req.user?.userId;
   if (!userId) {
      return res.status(HttpStatus.UNAUTHORIZED).json(
        ApiResponse.error(AUTH_MESSAGES.USER_AUTHENTICATION_NOT_FOUND)
      );
    }
   const dto = new GetPurchaseHistoryRequestDTO({
    userId:userId,
    page:Number(req.query.page) || 1,
    limit:Number(req.query.limit) || 10
   });
   const result = await this._getPurchaseHistoryUseCase.execute(dto);
   return res.status(HttpStatus.OK).json(ApiResponse.success(result));
}
}
