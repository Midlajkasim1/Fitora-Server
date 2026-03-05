import { IPaymentRepository } from "@/domain/interfaces/repositories/payment.repository";
import { PaymentEntity } from "@/domain/entities/payment/payment.entity";
import { PaymentMapper } from "../mappers/payment.mapper";
import { PaymentModel } from "../models/payment.models";
import { PaymentStatus } from "@/domain/constants/payment.constants";
import { IPaymentDocument } from "../interfaces/IPayment.document";

export class PaymentRepository implements IPaymentRepository {
    constructor(private readonly _paymentMapper: PaymentMapper) {}

    async create(payment: PaymentEntity): Promise<PaymentEntity> {
        const data = this._paymentMapper.toMongo(payment);
        const created = await PaymentModel.create(data);
        return this._paymentMapper.toEntity(created as IPaymentDocument);
    }

    async findByProviderId(providerId: string): Promise<PaymentEntity | null> {
        const doc = await PaymentModel.findOne({ provider_payment_id: providerId }).lean();
        return doc ? this._paymentMapper.toEntity(doc as IPaymentDocument) : null;
    }

    async updateStatus(providerId: string, status: PaymentStatus): Promise<void> {
        await PaymentModel.findOneAndUpdate(
            { provider_payment_id: providerId },
            { $set: { status } }
        ).exec();
    }
}