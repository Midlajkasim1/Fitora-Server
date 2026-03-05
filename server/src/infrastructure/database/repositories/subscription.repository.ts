import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { SubscriptionMapper } from "../mappers/subscription.mapper";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { SubscriptionModel } from "../models/subscription.model";

export class SubscriptionRepository implements ISubscriptionRepository {
    constructor(private readonly _subscriptionMapper: SubscriptionMapper) {}

    async create(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
        const data = this._subscriptionMapper.toMongo(subscription);
        const created = await SubscriptionModel.create(data);
        return this._subscriptionMapper.toEntity(created);
    }

    async findById(id: string): Promise<SubscriptionEntity | null> {
        const doc = await SubscriptionModel.findById(id).lean();
        return doc ? this._subscriptionMapper.toEntity(doc) : null;
    }

    async updateStatus(id: string, status: SubscriptionStatus): Promise<void> {
        await SubscriptionModel.findByIdAndUpdate(id, { $set: { status } }).exec();
    }

    async findActiveByUserId(userId: string): Promise<SubscriptionEntity | null> {
        const doc = await SubscriptionModel.findOne({
            user_id: userId,
            status: SubscriptionStatus.ACTIVE,
            end_date: { $gt: new Date() } 
        }).lean();
        
        return doc ? this._subscriptionMapper.toEntity(doc) : null;
    }
}