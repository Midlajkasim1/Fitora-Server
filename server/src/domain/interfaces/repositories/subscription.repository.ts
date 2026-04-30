import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { IBaseRepository } from "./base.repository";

export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    create(subscription: SubscriptionEntity): Promise<SubscriptionEntity>;
    updateStatus(id: string, status: string): Promise<void>;
    findActiveByUserId(userId: string): Promise<SubscriptionEntity | null>;
    findEveryActive(): Promise<{ userId: string }[]>;
    incrementUsedCredit(subscriptionId: string): Promise<void>;
    decrementUsedCredit(subscriptionId: string): Promise<void>;
    countActiveSubscriptions(): Promise<number>;
    getActiveSubscriptionCountsByPlan(): Promise<{ name: string, count: number }[]>;
}