import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ClientPreferenceEntity } from "@/domain/entities/user/client-preference.entity";
import { ClientPreferenceModel } from "../models/client-preference.model";
import { ClientPreferenceMapper } from "../mappers/client-preference.mapper";
import { Types } from "mongoose";

export class ClientPreferenceRepository implements IClientPreferenceRepository {
  async save(prefs: ClientPreferenceEntity): Promise<void> {
    const mongoData = ClientPreferenceMapper.toMongo(prefs);
    
    await ClientPreferenceModel.findOneAndUpdate(
      { user_id: mongoData.user_id },
      { $set: mongoData },
      { upsert: true, new: true }
    ).exec();
  }

  async findByUserId(userId: string): Promise<ClientPreferenceEntity | null> {
    const doc = await ClientPreferenceModel.findOne({ 
      user_id: new Types.ObjectId(userId) 
    }).lean();

    return doc ? ClientPreferenceMapper.toEntity(doc) : null;
  }

  async findById(id: string): Promise<ClientPreferenceEntity | null> {
    const doc = await ClientPreferenceModel.findById(id).lean();
    return doc ? ClientPreferenceMapper.toEntity(doc) : null;
  }
}