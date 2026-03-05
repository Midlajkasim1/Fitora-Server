import { PurchaseSubscriptionRequestDTO } from "@/application/dto/subscription/request/purchase-subscription.dto";
import { PurchaseSubscriptionResponseDTO } from "@/application/dto/subscription/response/purchaseSubscription.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SUBSCRIPTION_MESSAGES } from "@/domain/constants/messages.constants";
import { PaymentEntity } from "@/domain/entities/payment/payment.entity";
import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { IPaymentRepository } from "@/domain/interfaces/repositories/payment.repository";
import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { IPaymentProvider } from "@/domain/interfaces/services/paymentProvider.interface";


export class PurchaseSubscriptionUseCase implements IBaseUseCase<PurchaseSubscriptionRequestDTO,PurchaseSubscriptionResponseDTO>{
    constructor(
        private readonly _subscriptionPlanRepository:ISubscriptionPlanRepository,
        private readonly _subscriptionRepository:ISubscriptionRepository,
        private readonly _paymentService:IPaymentProvider,
        private readonly _paymentRepository:IPaymentRepository
    ){}
    async execute(dto: PurchaseSubscriptionRequestDTO): Promise<PurchaseSubscriptionResponseDTO> {
        const plan = await this._subscriptionPlanRepository.findById(dto.planId);
        if(!plan){
            throw new Error(SUBSCRIPTION_MESSAGES.SUBSCRIPTION_NOT_FOUND);
        }
        const session = await  this._paymentService.createCheckoutSession({
            userId: dto.userId,
            userName:dto.userName,
            userEmail: dto.userEmail,
            planId: plan.id!,
            planName: plan.name,
            amount: Number(plan.price),
            interval:plan.billingCycle
        });
       const endDate= new Date();
       endDate.setDate(endDate.getDate()+30);
       const subscription = SubscriptionEntity.create({
        planId:plan.id!,
        userId:dto.userId,
        endDate:endDate
       });
       const savedSub = await this._subscriptionRepository.create(subscription);
       const payment = PaymentEntity.create({
        userId:dto.userId,
        amount:Number(plan.price),
        paymentMethod:this._paymentService.getProviderName(),
        subscriptionId:savedSub.id,
        providerPaymentId:session.sessionId
       });
       await this._paymentRepository.create(payment);
       return {
        checkoutUrl:session.url
       };
    }
    
}