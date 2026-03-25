import { PaymentStatus } from "@/domain/constants/payment.constants";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { PaymentEntity } from "@/domain/entities/payment/payment.entity";


export interface IPaymentHistoryResult {
    paymentId: string;
    amount: number;
    status: PaymentStatus;
    subscriptionStatus: SubscriptionStatus;
    date: Date;
    planName: string;
    paymentMethod: string;
}
export interface IPaymentRepository {
    create(payment: PaymentEntity): Promise<PaymentEntity>;
    updateStatus(providerId: string, status: string): Promise<void>;
    findByProviderId(id: string): Promise<PaymentEntity | null>;
    findHistoryByUserId(userId:string,page:number,limit:number):Promise<{history:IPaymentHistoryResult[],total:number}>
}