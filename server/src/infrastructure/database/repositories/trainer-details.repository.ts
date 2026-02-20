import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { TrainerDetailsModel } from "../models/trainer-details.model";
import { TrainerDetailsMapper } from "../mappers/trainer-details.mapper";

import { Types } from "mongoose";

export class TrainerRepository implements ITrainerRepository {
  constructor(private readonly trainerMapper:TrainerDetailsMapper){}
 
  async save(details: TrainerDetailsEntity): Promise<void> {
    const mongoData = this.trainerMapper.toMongo(details);

    await TrainerDetailsModel.findOneAndUpdate(
      { user_id: mongoData.user_id },
      { $set: mongoData },
      { upsert: true, new: true }
    ).exec();
  }


  async findByUserId(userId: string): Promise<TrainerDetailsEntity | null> {
    const doc = await TrainerDetailsModel.findOne({ 
      user_id: new Types.ObjectId(userId) 
    }).lean();

    return doc ? this.trainerMapper.toEntity(doc) : null;
  }

  async findById(id: string): Promise<TrainerDetailsEntity | null> {
    const doc = await TrainerDetailsModel.findById(id).lean();
    return doc ? this.trainerMapper.toEntity(doc) : null;
  }
}