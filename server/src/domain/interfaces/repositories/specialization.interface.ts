import { SpecializationStatus } from "@/domain/constants/auth.constants";
import { SpecializationEntity } from "@/domain/entities/specialization/specialization.entity";
import { IBaseRepository } from "./base.repository";


export interface ISpecialization extends IBaseRepository<SpecializationEntity> {
  create(entity:SpecializationEntity):Promise<SpecializationEntity>;
  update(entity:SpecializationEntity):Promise<SpecializationEntity | null>;
  findByName(name:string):Promise<SpecializationEntity | null>;

}