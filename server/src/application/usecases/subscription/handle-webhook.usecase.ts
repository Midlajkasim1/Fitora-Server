import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { PAYMENT_MESSAGES } from "@/domain/constants/messages.constants";
import { PaymentStatus } from "@/domain/constants/payment.constants";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { IPaymentRepository } from "@/domain/interfaces/repositories/payment.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { logger } from "@/infrastructure/providers/loggers/logger";



export class HandleWebhookUseCase implements IBaseUseCase<string,void>{
    constructor(
        private readonly _paymentRepository:IPaymentRepository,
        private readonly _subscriptionRepository:ISubscriptionRepository
    ){}
   async execute(sessionId: string): Promise<void> {
        const payment = await this._paymentRepository.findByProviderId(sessionId);
        if(!payment){
            throw new Error(PAYMENT_MESSAGES.PAYMENT_NOT_FOUND);
        }
        await this._paymentRepository.updateStatus(sessionId,PaymentStatus.SUCCESS);
        if(payment.subscriptionId){
            await this._subscriptionRepository.updateStatus(
                payment.subscriptionId,
                SubscriptionStatus.ACTIVE
            );
            logger.info(`✅ Webhook: Subscription ${payment.subscriptionId} is now ACTIVE`);

        }
    }
}