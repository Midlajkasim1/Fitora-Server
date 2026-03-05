import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { IBaseRepository } from "./base.repository";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    create(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
    updateStatus(id: string, status: string): Promise<void>;
    findActiveByUserId(userId: string): Promise<SubscriptionEntity | null>;
}