import { ISubscriptionRepository } from "@/domain/interfaces/repositories/subscription.repository";
import { SubscriptionMapper } from "../mappers/subscription.mapper";
import { SubscriptionEntity } from "@/domain/entities/subscription/subscription.entity";
import { SubscriptionModel } from "../models/subscription.models";
import { SubscriptionStatus } from "@/domain/constants/subscription.constants";


export class SubscriptionRepository implements ISubscriptionRepository{
    constructor(
        private readonly subscriptionMapper:SubscriptionMapper
    ){}
    async create(subscription: SubscriptionEntity): Promise<SubscriptionEntity> {
       const data = this.subscriptionMapper.toMongo(subscription);
       const created = await SubscriptionModel.create(data);
       return this.subscriptionMapper.toEntity(created); 
    }
    async findByName(name: string): Promise<SubscriptionEntity | null> {
        const data = await SubscriptionModel.findOne({name}).lean();
        if(!data)return null;
        return this.subscriptionMapper.toEntity(data);

    }
 async   findAll(params: { page: number; limit: number; search?: string; status?: SubscriptionStatus; }): Promise<{ subscriptions: SubscriptionEntity[]; totals: number; }> {
        const {page,limit,search,status} = params;
         const skip = (page -  1) * limit;
         const filter:Record<string,unknown>={};
         if(status){
            filter.status=status;
         }
         if(search){
            filter.name={$regex:search,$options:"i"};
         }
         const [docs,totals]= await Promise.all([
            SubscriptionModel.find(filter)
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .lean(),
            SubscriptionModel.countDocuments(filter)

         ]);
         return {
            subscriptions:docs.map((doc)=>this.subscriptionMapper.toEntity(doc)),
            totals
         };
    }
   async findById(id: string): Promise<SubscriptionEntity | null> {
        const doc =  await SubscriptionModel.findById(id).lean();
        return doc ? this.subscriptionMapper.toEntity(doc) : null;
    }
    async update(subscription: SubscriptionEntity): Promise<SubscriptionEntity | null> {
        const  data = await SubscriptionModel.findByIdAndUpdate(subscription.id,
            {$set:this.subscriptionMapper.toMongo(subscription)},{new:true}
        ).lean();
        if(!data)return null;
        return this.subscriptionMapper.toEntity(data);
    }
    async updataStatus(id: string, status: SubscriptionStatus): Promise<void> {
        await SubscriptionModel.findByIdAndUpdate(id,
            {$set:{status:status}}
        ).exec();
    }
}