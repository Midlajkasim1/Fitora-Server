import { AdvertisementEntity } from "@/domain/entities/advertisement/advertisement.entity";
import { IAdvertisementRepository } from "@/domain/interfaces/repositories/advertisement.repository";
import { AdvertisementMapper } from "../mappers/advertisement.mapper";
import { AdvertisementModel } from "../models/advertisement.model";
import { IAdvertisementDocument } from "../interfaces/IAdvertisement.interface";
import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";
import { Model } from "mongoose";
import { BaseRepository } from "./base.repository";


export class AdvertisementRepository extends BaseRepository<AdvertisementEntity,IAdvertisementDocument> implements IAdvertisementRepository{
    constructor(
        private readonly _advertisementMapper : AdvertisementMapper
    ){
        super(AdvertisementModel as unknown as Model<IAdvertisementDocument>,_advertisementMapper);
    }
    async create(entity: AdvertisementEntity): Promise<AdvertisementEntity> {
        const data = this._advertisementMapper.toMongo(entity);
        const created = await AdvertisementModel.create(data);
        return this._advertisementMapper.toEntity(created as IAdvertisementDocument);

    }
    async findById(id: string): Promise<AdvertisementEntity | null> {
        const doc = await AdvertisementModel.findById(id).lean<IAdvertisementDocument>();
        
        return doc ? this._advertisementMapper.toEntity(doc) : null;
    }
    async findActiveAds(): Promise<AdvertisementEntity[]> {
        const now =  new Date();
        const docs = await AdvertisementModel.find({
            status:AdvertisementStatus.ACTIVE,
            startDate:{$lte:now},
            expiryDate:{$gte:now}
        }).lean<IAdvertisementDocument[]>();
        return docs.map((doc)=>this._advertisementMapper.toEntity(doc));
    }
    async update(id: string, update: Partial<AdvertisementEntity>): Promise<AdvertisementEntity | null> {
        const data =  await AdvertisementModel.findByIdAndUpdate(id,
            {$set:this._advertisementMapper.toMongo(update as AdvertisementEntity)},{new:true}
        ).lean();
        if(!data)return null;
        return this._advertisementMapper.toEntity(data);
    }
    async findAllAd(params: { page: number; limit: number; search?: string; status?: AdvertisementStatus; }): Promise<{ data: AdvertisementEntity[]; total: number; }> {
     const {page,limit,search,status} =  params;
    const skip = (page - 1) * limit;
    const filter :Record<string,unknown>={};
    if(status){
        filter.status=status;
    }
    if(search){
        filter.brandName ={$regex:search,$options:"i"};
    };
    const [docs,total]= await Promise.all([
       AdvertisementModel.find(filter)
       .sort({createdAt:-1})
       .skip(skip)
       .limit(limit)
       .lean(),
       AdvertisementModel.countDocuments(filter)
    ]);
    return {
        data:docs.map((doc)=>this._advertisementMapper.toEntity(doc)),
        total
    };
    }
    async updateStatus(id: string, status: AdvertisementStatus): Promise<void> {
        await AdvertisementModel.findByIdAndUpdate(id,
            {$set:{status:status}},{new:true}
        ).exec();
    }
  
    
}