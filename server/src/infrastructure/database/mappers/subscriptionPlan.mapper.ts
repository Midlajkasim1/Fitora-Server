import { SubscriptionPlanEntity } from "@/domain/entities/subscription/subscriptionplan.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { ISubscriptionDocument } from "../interfaces/ISubscriptionPlan.document";



export class SubscriptionPlanMapper implements IMapper<SubscriptionPlanEntity,ISubscriptionDocument>{
    toEntity(doc: ISubscriptionDocument): SubscriptionPlanEntity {
        return SubscriptionPlanEntity.create({
            id: doc._id.toString(),
            name: doc.name,
            price: doc.price,
            billingCycle: doc.billingCycle,
            description: doc.description,
            status: doc.status,
            sessionType: doc.sessionType,
            sessionCredits: doc.sessionCredits,
            hasAiWorkout: doc.hasAiWorkout,
            hasAiDiet: doc.hasAiDiet,
            totalPurchaseUser: doc.totalPurchaseUser,
            createdAt: doc.createdAt
        });
    }
    toMongo(entity: SubscriptionPlanEntity): Partial<ISubscriptionDocument> {
        return{
            name: entity.name,
            price: entity.price.toString(),
            billingCycle: entity.billingCycle,
            description: entity.description,
            status: entity.status,
            sessionType: entity.sessionType,
            sessionCredits: entity.sessionCredits,
            hasAiWorkout: entity.hasAiWorkout,
            hasAiDiet: entity.hasAiDiet,
            totalPurchaseUser: entity.totalPurchaseUser
        };
    }
}