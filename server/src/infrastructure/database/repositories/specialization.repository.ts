import { ISpecialization } from "@/domain/interfaces/repositories/specialization.interface";
import { SpecializationMapper } from "../mappers/specialization.mapper";
import { SpecializationEntity } from "@/domain/entities/specialization/specialization.entity";
import { SpecializationModel } from "../models/specialization.model";



export class SpecializationRepository implements ISpecialization {

    constructor(private readonly  specializationMapper:SpecializationMapper){}

    async create(entity: SpecializationEntity): Promise<SpecializationEntity> {
        const  data = this.specializationMapper.toMongo(entity);
        
        const doc = await SpecializationModel.create(data);
        return this.specializationMapper.toEntity(doc);

    }

    async findById(id: string): Promise<SpecializationEntity | null> {
      const doc = await SpecializationModel.findById(id).lean();
      return doc ? this.specializationMapper.toEntity(doc) : null;
    }

  async update(entity: SpecializationEntity): Promise<SpecializationEntity | null> {
      const data = await SpecializationModel.findByIdAndUpdate(entity.id,
        {$set:this.specializationMapper.toMongo(entity)},{new:true}
      ).lean();
   if(!data)return null;
    return this.specializationMapper.toEntity(data);
  }
  async findByName(name: string): Promise<SpecializationEntity | null> {
        const data = await SpecializationModel.findOne({name}).lean();
        if(!data)return null;
        return this.specializationMapper.toEntity(data);
  }



}