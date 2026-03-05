import { GetSubscriptionPlanByIdRequestDTO } from "@/application/dto/subscription/request/get-subscriptionByIdPlan.dto";
import { GetSubscriptionPlanRequestDTO } from "@/application/dto/subscription/request/get-subscriptionPlan.dto";
import { PurchaseSubscriptionRequestDTO } from "@/application/dto/subscription/request/purchase-subscription.dto";
import { GetSubscriptionPlanByIdResponseDTO } from "@/application/dto/subscription/response/get-subscriptionById.dto";
import { GetSubscriptionPlanResponseDTO } from "@/application/dto/subscription/response/get-subscriptionPlan.dto";
import { PurchaseSubscriptionResponseDTO } from "@/application/dto/subscription/response/purchaseSubscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";
import { IPaymentProvider } from "@/domain/interfaces/services/paymentProvider.interface";
import { Request, Response } from "express";




export class UserSubscriptionController{
    constructor(
        private readonly _getSubscriptionUseCase:IBaseUseCase<GetSubscriptionPlanRequestDTO,GetSubscriptionPlanResponseDTO>,
        private readonly _getSubscriptionByIdUseCase: IBaseUseCase<GetSubscriptionPlanByIdRequestDTO,GetSubscriptionPlanByIdResponseDTO>,
        private readonly _purchaseSubscriptionUseCase: IBaseUseCase<PurchaseSubscriptionRequestDTO,PurchaseSubscriptionResponseDTO>,
        private readonly _webhookUseCase:IBaseUseCase<string,void>,
        private readonly _paymentProvider:IPaymentProvider
    ){}
    async getUserSubscriptionPlan(req:Request,res:Response):Promise<Response>{
     const dto:GetSubscriptionPlanRequestDTO={
     page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status: SubscriptionPlanStatus.ACTIVE,        
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
  async purchasePlan(req:Request,res:Response):Promise<Response>{


       if (!req.user?.userId || !req.user?.email || !req.user?.name) {
       
            throw new Error(AUTH_MESSAGES.USER_AUTHENTICATION_NOT_FOUND);
        }


     const dto={
      userId:req.user?.userId,
      userEmail:req.user?.email,
      userName:req.user?.name,
      planId:req.body.planId
    };
    
    const result = await this._purchaseSubscriptionUseCase.execute(dto);
    return res.status(HttpStatus.OK).json({
      success:true,
      data:result
    });
  }
  async handlewebhook(req:Request,res:Response):Promise<Response>{
    const signature = req.headers["stripe-signature"] as string;
    if(!signature){
      return res.status(HttpStatus.BAD_REQUEST).json({success: false, message: "No signature"});
    }
    const event = this._paymentProvider.verifyWebhook(req.body,signature);
    if(event.type === "checkout.session.completed"){
      await this._webhookUseCase.execute(event.sessionId);
    }
    return res.status(HttpStatus.OK).json({recieved:true});
  }

}