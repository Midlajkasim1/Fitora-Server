import { HandleWebhookRequestDTO } from "@/application/dto/subscription/request/handle-webhook.dto";
import { HandleWebhookResponseDTO } from "@/application/dto/subscription/response/handle-webhook.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { PAYMENT_MESSAGES, SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { PaymentStatus } from "@/domain/constants/payment.constants";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { IPaymentRepository } from "@/domain/interfaces/repositories/payment.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";

export class HandleWebhookUseCase implements IBaseUseCase<HandleWebhookRequestDTO, HandleWebhookResponseDTO> {
    constructor(
        private readonly _paymentRepository: IPaymentRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository 
    ) {}

    async execute(dto: HandleWebhookRequestDTO): Promise<HandleWebhookResponseDTO> {
        const payment = await this._paymentRepository.findByProviderId(dto.sessionId);
        if (!payment) throw new Error(PAYMENT_MESSAGES.PAYMENT_NOT_FOUND);
        if(dto.type === SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CHECKOUT_SESSION_COMPLETED){
           await this._paymentRepository.updateStatus(dto.sessionId, PaymentStatus.SUCCESS);
           if(payment.subscriptionId){
            await this._subscriptionRepository.updateStatus(payment.subscriptionId,SubscriptionStatus.ACTIVE);
            const sub = await this._subscriptionRepository.findById(payment.subscriptionId);
            if(sub) await this._subscriptionPlanRepository.updatePurchasedCount(sub.planId);
           }
           return new HandleWebhookResponseDTO({success:true,message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_ACTIVATED,recieved:true});

        }
        if(dto.type === SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CHECKOUT_SESSION_EXPIRED){
            await this._paymentRepository.updateStatus(dto.sessionId,PaymentStatus.FAILED);
            if(payment.subscriptionId){
                await this._subscriptionRepository.updateStatus(payment.subscriptionId,SubscriptionStatus.CANCELLED);

            }
            return new HandleWebhookResponseDTO({success:true,message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_SESSION_EXPIRED,recieved:true});
        }
      return new HandleWebhookResponseDTO({
        success:false,
        message:SUBSCRIPTION_MESSAGES.SUBCRIPTION_UNHANDLED_TYPE,
        recieved:true});
    }
}