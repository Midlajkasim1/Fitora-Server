import { Types } from "mongoose";
import { PaymentEntity } from "@/domain/entities/payment/payment.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { IPaymentDocument } from "../interfaces/IPayment.document";
import { PaymentStatus } from "@/domain/constants/payment.constants";

export class PaymentMapper implements IMapper<PaymentEntity, IPaymentDocument> {
    toEntity(doc: IPaymentDocument): PaymentEntity {
        return new PaymentEntity({
            id: doc._id.toString(),
            userId: doc.user_id.toString(),
            subscriptionId: doc.subscription_id?.toString(),
            amount: doc.amount,
            status: doc.status as PaymentStatus,
            paymentMethod: doc.payment_method, 
            providerPaymentId: doc.provider_payment_id,
            createdAt: doc.createdAt
        });
    }

    toMongo(entity: PaymentEntity): Partial<IPaymentDocument> {
        return {
            user_id: new Types.ObjectId(entity.userId),
            subscription_id: entity.subscriptionId ? new Types.ObjectId(entity.subscriptionId)  : undefined,
            amount: entity.amount,
            status: entity.status,
            provider_payment_id: entity.providerPaymentId,
            payment_method: entity.paymentMethod 
        };
    }
}