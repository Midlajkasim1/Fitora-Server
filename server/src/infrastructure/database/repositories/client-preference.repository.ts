import { IClientPreferenceRepository } from "@/domain/interfaces/repositories/onboarding/iclient.repository";
import { ClientPreferenceEntity } from "@/domain/entities/user/client-preference.entity";
import { ClientPreferenceModel } from "../models/client-preference.model";
import { ClientPreferenceMapper } from "../mappers/client-preference.mapper";
import { Model, Types } from "mongoose";
import { IClientPreferenceDocument } from "../interfaces/client-preference-document.interface";
import { BaseRepository } from "./base.repository";

export class ClientPreferenceRepository extends BaseRepository<ClientPreferenceEntity,IClientPreferenceDocument> implements IClientPreferenceRepository {
  constructor(private readonly clientPreferenceMapper: ClientPreferenceMapper) {
    super(ClientPreferenceModel as unknown as Model<IClientPreferenceDocument>, clientPreferenceMapper);
  }
  async save(prefs: ClientPreferenceEntity): Promise<void> {
    const mongoData = this.clientPreferenceMapper.toMongo(prefs);
    
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

    return doc ? this.clientPreferenceMapper.toEntity(doc) : null;
  }

  async findById(id: string): Promise<ClientPreferenceEntity | null> {
    const doc = await ClientPreferenceModel.findById(id).lean();
    return doc ? this.clientPreferenceMapper.toEntity(doc) : null;
  }
  async update(id:string,entity:Partial<ClientPreferenceEntity>): Promise<ClientPreferenceEntity | null> {
    const data = await ClientPreferenceModel.findByIdAndUpdate(id,
      {$set:this.clientPreferenceMapper.toMongo(entity as ClientPreferenceEntity)},{new:true}
    ).lean();
    if(!data)return null;
    return this.clientPreferenceMapper.toEntity(data);
  }
}