import { ClientPreferenceEntity } from "@/domain/entities/user/client-preference.entity";
import { IClientPreferenceDocument } from "../interfaces/client-preference-document.interface";
import { Types } from "mongoose";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";

export class ClientPreferenceMapper implements IMapper<ClientPreferenceEntity,IClientPreferenceDocument> {
   toEntity(doc: IClientPreferenceDocument): ClientPreferenceEntity {
    return new ClientPreferenceEntity({
      id: doc._id.toString(),
      userId: doc.user_id.toString(),
      sleepHours: doc.sleep_hours,
      waterIntake: doc.water_intake,
      primaryMotives: doc.primary_motives,
      preferredWorkouts: doc.preferred_workouts.map(id=>id.toString()),
      experienceLevel: doc.experience_level,
      dietPreference: doc.diet_preference,
      medicalConditions: doc.medical_conditions
    });
  }

   toMongo(entity: ClientPreferenceEntity): Partial<IClientPreferenceDocument> {
    return {
      user_id: new Types.ObjectId(entity.userId),
      sleep_hours: entity.sleepHours,
      water_intake: entity.waterIntake, 
      primary_motives: entity.primaryMotives,
      preferred_workouts: entity.preferredWorkouts,
      experience_level: entity.experienceLevel,
      diet_preference: entity.dietPreference,
      medical_conditions: entity.medicalConditions
    };
  }
}