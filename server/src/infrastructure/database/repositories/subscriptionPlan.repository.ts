import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";
import { SubscriptionPlanEntity } from "@/domain/entities/subscription/subscriptionplan.entity";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { SubscriptionPlanMapper } from "../mappers/subscriptionPlan.mapper";
import { SubscriptionPlanModel } from "../models/subscriptionPlan.models";


export class SubscriptionplanRepository implements ISubscriptionPlanRepository{
    constructor(
        private readonly subscriptionMapper:SubscriptionPlanMapper
    ){}
    async create(subscription: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity> {
       const data = this.subscriptionMapper.toMongo(subscription);
       const created = await SubscriptionPlanModel.create(data);
       return this.subscriptionMapper.toEntity(created); 
    }
    async findByName(name: string): Promise<SubscriptionPlanEntity | null> {
        const data = await SubscriptionPlanModel.findOne({name}).lean();
        if(!data)return null;
        return this.subscriptionMapper.toEntity(data);

    }
 async   findAll(params: { page: number; limit: number; search?: string; status?: SubscriptionPlanStatus; }): Promise<{ subscriptions: SubscriptionPlanEntity[]; totals: number; }> {
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
            SubscriptionPlanModel.find(filter)
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .lean(),
            SubscriptionPlanModel.countDocuments(filter)

         ]);
         return {
            subscriptions:docs.map((doc)=>this.subscriptionMapper.toEntity(doc)),
            totals
         };
    }
   async findById(id: string): Promise<SubscriptionPlanEntity | null> {
        const doc =  await SubscriptionPlanModel.findById(id).lean();
        return doc ? this.subscriptionMapper.toEntity(doc) : null;
    }
    async update(subscription: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity | null> {
        const  data = await SubscriptionPlanModel.findByIdAndUpdate(subscription.id,
            {$set:this.subscriptionMapper.toMongo(subscription)},{new:true}
        ).lean();
        if(!data)return null;
        return this.subscriptionMapper.toEntity(data);
    }
    async updataStatus(id: string, status: SubscriptionPlanStatus): Promise<void> {
        await SubscriptionPlanModel.findByIdAndUpdate(id,
            {$set:{status:status}}
        ).exec();
    }
}