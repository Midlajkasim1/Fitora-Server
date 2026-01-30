
import { IBaseRepository } from "../base.repository";
import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
export interface ITrainerRepository extends IBaseRepository<TrainerDetailsEntity> {

  save(details: TrainerDetailsEntity): Promise<void>;

  findByUserId(userId: string): Promise<TrainerDetailsEntity | null>;
}