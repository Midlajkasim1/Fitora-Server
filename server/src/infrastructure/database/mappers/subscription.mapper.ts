import { Types } from "mongoose";
import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { ISubscriptionDocument } from "../interfaces/ISubscription.document";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";

export class SubscriptionMapper implements IMapper<SubscriptionEntity, ISubscriptionDocument> {
    toEntity(doc: ISubscriptionDocument): SubscriptionEntity {
        return new SubscriptionEntity({
            id: doc._id.toString(),
            planId: doc.plan_id.toString(),
            userId: doc.user_id.toString(),
            status: doc.status as SubscriptionStatus,
            startDate: doc.start_date,
            endDate: doc.end_date,
            usedCredits: doc.usedCredits
        });
    }

    toMongo(entity: SubscriptionEntity): Partial<ISubscriptionDocument> {
        return {
            plan_id: new Types.ObjectId(entity.planId),
            user_id: new Types.ObjectId(entity.userId),
            status: entity.status,
            start_date: entity.startDate,
            end_date: entity.endDate
        };
    }
}