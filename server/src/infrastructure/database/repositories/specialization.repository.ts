import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";
import { SpecializationMapper } from "../mappers/specialization.mapper";
import { SpecializationEntity } from "@/domain/entities/specialization/specialization.entity";
import { SpecializationModel } from "../models/specialization.model";
import { SpecializationStatus } from "@/domain/constants/auth.constants";
import { BaseRepository } from "./base.repository";
import { ISpecializationDocument } from "../interfaces/specialization-interface";
import { Model } from "mongoose";



export class SpecializationRepository extends BaseRepository<SpecializationEntity,ISpecializationDocument> implements ISpecialization {

    constructor(private readonly  specializationMapper:SpecializationMapper){
      super(SpecializationModel as unknown as Model<ISpecializationDocument>,specializationMapper);
    }

    async create(entity: SpecializationEntity): Promise<SpecializationEntity> {
        const  data = this.specializationMapper.toMongo(entity);
        
        const doc = await SpecializationModel.create(data);
        return this.specializationMapper.toEntity(doc);

    }

    async findById(id: string): Promise<SpecializationEntity | null> {
      const doc = await SpecializationModel.findById(id).lean();
      return doc ? this.specializationMapper.toEntity(doc) : null;
    }

  async update(id: string,entity:Partial<SpecializationEntity>): Promise<SpecializationEntity | null> {
      const data = await SpecializationModel.findByIdAndUpdate(id,
        {$set:this.specializationMapper.toMongo(entity as SpecializationEntity)},{new:true}
      ).lean();
   if(!data)return null;
    return this.specializationMapper.toEntity(data);
  }
  async findByName(name: string): Promise<SpecializationEntity | null> {
        const data = await SpecializationModel.findOne({name}).lean();
        if(!data)return null;
        return this.specializationMapper.toEntity(data);

  }
  async findAllSP(params: {
        page: number; 
        limit: number;
         search?: string; 
         status?: SpecializationStatus;
         }): Promise<{ data: SpecializationEntity[]; total: number; }> {
     
        const {page,limit,search,status}= params;
        const skip = (page - 1) * limit;
        const filter : Record<string,unknown> ={};

        if(status){
            filter.status=status;
        }
        if(search){
            filter.name={$regex:search,$options:"i"};
        }
            
     const [docs,total]= await Promise.all([
        SpecializationModel.find(filter)
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit)
        .lean(),
        SpecializationModel.countDocuments(filter)
        
     ]);

     return {
       data:docs.map((doc)=>this.specializationMapper.toEntity(doc)),
       total
     };

  }

  async updateStatus(id: string, status: SpecializationStatus): Promise<void> {
     await SpecializationModel.findByIdAndUpdate(id,
      {$set:{status:status}}
     ).exec();
  }
  async findByIds(ids: string[]): Promise<SpecializationEntity[]> {
    const docs = await SpecializationModel.find({
      _id:{$in:ids}
    }).lean();
    return docs.map(doc=>this.specializationMapper.toEntity(doc));
  }

}