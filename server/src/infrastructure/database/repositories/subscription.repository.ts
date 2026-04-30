import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { SubscriptionMapper } from "../mappers/subscription.mapper";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { SubscriptionModel } from "../models/subscription.model";
import { Model, Types } from "mongoose";
import { ISubscriptionDocument } from "../interfaces/ISubscription.document";
import { BaseRepository } from "./base.repository";


export class SubscriptionRepository extends BaseRepository<SubscriptionEntity,ISubscriptionDocument> implements ISubscriptionRepository {
    constructor(private readonly _subscriptionMapper: SubscriptionMapper) {
        super(SubscriptionModel as unknown as Model<ISubscriptionDocument>,_subscriptionMapper );
    }

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
        await SubscriptionModel.findByIdAndUpdate(id, { $set: { status } },{new:true}).exec();
    }

    async findActiveByUserId(userId: string): Promise<SubscriptionEntity | null> {
        const doc = await SubscriptionModel.findOne({
            user_id: new Types.ObjectId(userId),
            status: SubscriptionStatus.ACTIVE,
            end_date: { $gt: new Date() } 
        }).lean();
        if(!doc)return null;
        
        return this._subscriptionMapper.toEntity(doc as ISubscriptionDocument);
    }
    async findEveryActive(): Promise<{ userId: string; }[]> {
        const docs = await SubscriptionModel.find({
            status: SubscriptionStatus.ACTIVE,
            end_date: { $gt: new Date() }
        })
        .select("user_id") 
        .lean();

        return docs.map(doc => ({
            userId: doc.user_id.toString()
        }));
    }

    async incrementUsedCredit(subscriptionId: string): Promise<void> {
        await SubscriptionModel.findByIdAndUpdate(subscriptionId, { $inc: { usedCredits: 1 } });
    }

    async decrementUsedCredit(subscriptionId: string): Promise<void> {
        await SubscriptionModel.findByIdAndUpdate(subscriptionId, { $inc: { usedCredits: -1 } });
    }

    async countActiveSubscriptions(): Promise<number> {
        return await SubscriptionModel.countDocuments({
            status: SubscriptionStatus.ACTIVE,
            end_date: { $gt: new Date() }
        });
    }

    async getActiveSubscriptionCountsByPlan(): Promise<{ name: string, count: number }[]> {
        return await SubscriptionModel.aggregate([
            {
                $match: {
                    status: SubscriptionStatus.ACTIVE,
                    end_date: { $gt: new Date() }
                }
            },
            {
                $lookup: {
                    from: "subscriptionplans",
                    localField: "plan_id",
                    foreignField: "_id",
                    as: "plan"
                }
            },
            { $unwind: "$plan" },
            {
                $group: {
                    _id: "$plan.name",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    count: 1
                }
            }
        ]);
    }
}