import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { ISubscriptionDocument } from "../interfaces/ISubscription.document";



export class SubscriptionMapper implements IMapper<SubscriptionEntity,ISubscriptionDocument>{
    toEntity(doc: ISubscriptionDocument): SubscriptionEntity {
        return SubscriptionEntity.create({
            id: doc._id.toString(),
            name: doc.name,
            price: doc.price,
            billingCycle: doc.billingCycle,
            description: doc.description,
            status: doc.status,
            createdAt: doc.createdAt
        });
    }
    toMongo(entity: SubscriptionEntity): Partial<ISubscriptionDocument> {
        return{
            name: entity.name,
            price: entity.price.toString(),
            billingCycle: entity.billingCycle,
            description: entity.description,
            status: entity.status
        };
    }
}