import { IPaymentHistoryResult, IPaymentRepository } from "@/domain/interfaces/repositories/payment.repository";
import { PaymentEntity } from "@/domain/entities/payment/payment.entity";
import { PaymentMapper } from "../mappers/payment.mapper";
import { PaymentModel } from "../models/payment.models";
import { PaymentStatus } from "@/domain/constants/payment.constants";
import { IPaymentDocument } from "../interfaces/IPayment.document";
import { IPaymentHistory } from "../interfaces/IPayment-history.interface";
import { Types, Model } from "mongoose";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { BaseRepository } from "./base.repository";

export class PaymentRepository extends BaseRepository<PaymentEntity, IPaymentDocument> implements IPaymentRepository {
    constructor(private readonly _paymentMapper: PaymentMapper) {
        super(PaymentModel as unknown as Model<IPaymentDocument>, _paymentMapper);
    }

    async findByProviderId(providerId: string): Promise<PaymentEntity | null> {
        const doc = await PaymentModel.findOne({ provider_payment_id: providerId }).lean<IPaymentDocument>();
        return doc ? this._paymentMapper.toEntity(doc) : null;
    }

    async updateStatus(providerId: string, status: PaymentStatus): Promise<void> {
        await PaymentModel.findOneAndUpdate(
            { provider_payment_id: providerId },
            { $set: { status } }
        ).exec();
    }

    async findHistoryByUserId(userId: string, page: number, limit: number): Promise<{ history: IPaymentHistoryResult[]; total: number; }> {
        const skip = (page-1) * limit;
        const data = await PaymentModel.aggregate<IPaymentHistory>([
            {$match:{user_id: new Types.ObjectId(userId)}},
            {$sort:{createdAt:-1}},
            {$skip:skip},
            {$limit:limit},
            {
                $lookup:{
                    from:"subscriptions",
                    localField:"subscription_id",
                    foreignField:"_id",
                    as:"sub"
                    
                }
            },
            {$unwind:{path:"$sub",preserveNullAndEmptyArrays:true}},
            {
                $lookup:{
                    from:"subscriptionplans",
                    localField:"sub.plan_id",
                    foreignField:"_id",
                    as:"planDetails"
                }
            }
        ]);
        const history :IPaymentHistoryResult[]= data.map((item)=>({
            paymentId:item._id.toString(),
            amount:item.amount,
            status:item.status as PaymentStatus,
            subscriptionStatus:(item.sub?.status as SubscriptionStatus),
            date:item.createdAt,
            paymentMethod:item.payment_method,
            planName:item.planDetails[0]?.name
        }));
        const total = await PaymentModel.countDocuments({user_id:new Types.ObjectId(userId)});
        return {history,total};
    }
}