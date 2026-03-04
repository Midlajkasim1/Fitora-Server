import { SpecializationEntity } from "@/domain/entities/specialization/specialization.entity";
import { IBaseRepository } from "./base.repository";
import { SpecializationStatus } from "@/domain/constants/auth.constants";


export interface ISpecialization extends IBaseRepository<SpecializationEntity> {
  create(entity:SpecializationEntity):Promise<SpecializationEntity>;
  update(entity:SpecializationEntity):Promise<SpecializationEntity | null>;
  findByName(name:string):Promise<SpecializationEntity | null>;
  findAll(params:{
    page:number,
    limit:number,
    search?:string,
    status?:SpecializationStatus
  }):Promise<{specializations:SpecializationEntity[];total:number}>

    updateStatus(id:string,status:SpecializationStatus):Promise<void>;
    findByIds(ids:string[]):Promise<SpecializationEntity[]>
}