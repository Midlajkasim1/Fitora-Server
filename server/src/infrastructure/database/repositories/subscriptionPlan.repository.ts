import { SubscriptionPlanStatus } from "@/domain/constants/subscription.constants";
import { SubscriptionPlanEntity } from "@/domain/entities/subscription/subscriptionplan.entity";
import { ISubscriptionPlanRepository } from "@/domain/interfaces/repositories/subscriptionPlan.repository";
import { SubscriptionPlanMapper } from "../mappers/subscriptionPlan.mapper";
import { SubscriptionPlanModel } from "../models/subscriptionPlan.models";
import { BaseRepository } from "./base.repository";
import { ISubscriptionDocument } from "../interfaces/ISubscriptionPlan.document";
import { Model } from "mongoose";


export class SubscriptionplanRepository extends BaseRepository<SubscriptionPlanEntity,ISubscriptionDocument> implements ISubscriptionPlanRepository{
    constructor(
        private readonly subscriptionPlanMapper:SubscriptionPlanMapper
    ){
        super(SubscriptionPlanModel as unknown as Model<ISubscriptionDocument>,subscriptionPlanMapper);
    }
    async create(subscription: SubscriptionPlanEntity): Promise<SubscriptionPlanEntity> {
       const data = this.subscriptionPlanMapper.toMongo(subscription);
       const created = await SubscriptionPlanModel.create(data);
       return this.subscriptionPlanMapper.toEntity(created); 
    }
    async findByName(name: string): Promise<SubscriptionPlanEntity | null> {
        const data = await SubscriptionPlanModel.findOne({name}).lean();
        if(!data)return null;
        return this.subscriptionPlanMapper.toEntity(data);

    }
   async  findAllSPlan(params: { page: number; limit: number; search?: string; status?: SubscriptionPlanStatus; }): Promise<{ data: SubscriptionPlanEntity[]; total: number; }> {
        const {page,limit,search,status} = params;
         const skip = (page -  1) * limit;
         const filter:Record<string,unknown>={};
         if(status){
            filter.status=status;
         }
         if(search){
            filter.name={$regex:search,$options:"i"};
         }
         const [docs,total]= await Promise.all([
            SubscriptionPlanModel.find(filter)
            .sort({createdAt:-1})
            .skip(skip)
            .limit(limit)
            .lean(),
            SubscriptionPlanModel.countDocuments(filter)

         ]);
         return {
            data:docs.map((doc)=>this.subscriptionPlanMapper.toEntity(doc)),
            total,
         };
    }
   async findById(id: string): Promise<SubscriptionPlanEntity | null> {
        const doc =  await SubscriptionPlanModel.findById(id).lean();
        return doc ? this.subscriptionPlanMapper.toEntity(doc) : null;
    }
    async update(id:string,entity:Partial<SubscriptionPlanEntity>): Promise<SubscriptionPlanEntity | null> {
        const  data = await SubscriptionPlanModel.findByIdAndUpdate(id,
            {$set:this.subscriptionPlanMapper.toMongo(entity as SubscriptionPlanEntity)},{new:true}
        ).lean();
        if(!data)return null;
        return this.subscriptionPlanMapper.toEntity(data);
    }
    async updataStatus(id: string, status: SubscriptionPlanStatus): Promise<void> {
        await SubscriptionPlanModel.findByIdAndUpdate(id,
            {$set:{status:status}}
        ).exec();
    }
    async updatePurchasedCount(planId: string): Promise<void> {
        await SubscriptionPlanModel.findByIdAndUpdate(planId,
            {$inc:{totalPurchaseUser:1}}
        );
    }
 
}