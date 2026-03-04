import { SubscriptionStatus } from "@/domain/constants/subscription.constants";
import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { IBaseRepository } from "./base.repository";



export interface ISubscriptionRepository extends IBaseRepository<SubscriptionEntity> {
    create(subscription:SubscriptionEntity):Promise<SubscriptionEntity>;
    findByName(name:string):Promise<SubscriptionEntity | null>;
    findAll(params:{
        page:number,
        limit:number,
        search?:string,
        status?:SubscriptionStatus
    }):Promise<{subscriptions:SubscriptionEntity[];totals:number}>
    update(subscription:SubscriptionEntity):Promise<SubscriptionEntity | null>;
    updataStatus(id:string,status:SubscriptionStatus):Promise<void>;
}