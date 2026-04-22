import { HandleWebhookRequestDTO } from "@/application/dto/subscription/request/handle-webhook.dto";
import { HandleWebhookResponseDTO } from "@/application/dto/subscription/response/handle-webhook.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { NOTIFICATION_TEMPLATES, PAYMENT_MESSAGES, SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { NotificationType } from "@/domain/constants/notification.constants";
import { PaymentStatus } from "@/domain/constants/payment.constants";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { IPaymentRepository } from "@/domain/interfaces/repositories/payment.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { INotificationService } from "@/domain/interfaces/services/notification-service.interface";
import { ITransactionRepository } from "@/domain/interfaces/repositories/transaction.repository";
import { TransactionEntity, TransactionType } from "@/domain/entities/transaction/transaction.entity";

import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";

export class HandleWebhookUseCase implements IBaseUseCase<HandleWebhookRequestDTO, HandleWebhookResponseDTO> {
    constructor(
        private readonly _paymentRepository: IPaymentRepository,
        private readonly _subscriptionRepository: ISubscriptionRepository,
        private readonly _subscriptionPlanRepository: ISubscriptionPlanRepository ,
        private readonly _notificationService:INotificationService,
        private readonly _transactionRepository: ITransactionRepository,
        private readonly _userRepository: IUserRepository
    ) {}

    async execute(dto: HandleWebhookRequestDTO): Promise<HandleWebhookResponseDTO> {
        const payment = await this._paymentRepository.findByProviderId(dto.sessionId);
        if (!payment) throw new Error(PAYMENT_MESSAGES.PAYMENT_NOT_FOUND);

        const user = await this._userRepository.findById(payment.userId);
        const userName = user ? `${user.firstName} ${user.lastName}` : "Unknown Client";

        if(dto.type === SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CHECKOUT_SESSION_COMPLETED){
           await this._paymentRepository.updateStatus(dto.sessionId, PaymentStatus.SUCCESS);
           if(payment.subscriptionId){
            await this._subscriptionRepository.updateStatus(payment.subscriptionId,SubscriptionStatus.ACTIVE);
            const sub = await this._subscriptionRepository.findById(payment.subscriptionId);
            if(sub) await this._subscriptionPlanRepository.updatePurchasedCount(sub.planId);
            await this._notificationService.notify(payment.userId, {
                        title: "Subscription Activated!",
                        message: "Welcome to the Fitora family! Your subscription is now active. Let's hit those goals!",
                        type: NotificationType.SUBSCRIPTION_ACTIVE
                    });

            // Record Financial Inflow (Admin Revenue)
            const inflowTransaction = TransactionEntity.create({
                userId: payment.userId,
                entityName: userName,
                amount: payment.amount,
                type: TransactionType.SUBSCRIPTION_PURCHASE,
                description: `Subscription activation for ${payment.subscriptionId}`,
                referenceId: payment.subscriptionId || undefined
            });
            await this._transactionRepository.create(inflowTransaction);
           }
           return new HandleWebhookResponseDTO({success:true,message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_ACTIVATED,recieved:true});

        }
        if(dto.type === SUBSCRIPTION_MESSAGES.SUBSCRIPTION_CHECKOUT_SESSION_EXPIRED){
            await this._paymentRepository.updateStatus(dto.sessionId,PaymentStatus.FAILED);
            if(payment.subscriptionId){
                await this._subscriptionRepository.updateStatus(payment.subscriptionId,SubscriptionStatus.CANCELLED);
                await this._notificationService.notify(payment.userId, {
                        title: NOTIFICATION_TEMPLATES.SUBSCRIPTION_ACTIVATED.TITLE,
                        message: NOTIFICATION_TEMPLATES.SUBSCRIPTION_ACTIVATED.MESSAGE,
                        type: NotificationType.SYSTEM_ALERT
                    });

            }
            return new HandleWebhookResponseDTO({success:true,message:SUBSCRIPTION_MESSAGES.SUBSCRIPTION_SESSION_EXPIRED,recieved:true});
        }
      return new HandleWebhookResponseDTO({
        success:false,
        message:SUBSCRIPTION_MESSAGES.SUBCRIPTION_UNHANDLED_TYPE,
        recieved:true});
    }
}