import { PaymentEntity } from "@/domain/entities/payment/payment.entity";

export interface IPaymentRepository {
    create(payment: PaymentEntity): Promise<PaymentEntity>;
    updateStatus(providerId: string, status: string): Promise<void>;
    findByProviderId(id: string): Promise<PaymentEntity | null>;
}