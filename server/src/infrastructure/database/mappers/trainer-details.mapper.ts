import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { ITrainerDetailsDocument } from "../interfaces/trainer-details-document.interface";
import { Types } from "mongoose";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { ApprovalStatus } from "@/domain/constants/auth.constants";

export class TrainerDetailsMapper implements IMapper<TrainerDetailsEntity,ITrainerDetailsDocument> {
   toEntity(doc: ITrainerDetailsDocument): TrainerDetailsEntity {
    return new TrainerDetailsEntity({
      id: doc._id.toString(),
      userId: doc.user_id.toString(),
      bio: doc.bio,
      experienceYear: doc.experience_year,
      certifications: doc.certifications,
      specializations: doc.specializations,
      approvalStatus: doc.approval_status as ApprovalStatus
    });
  }

   toMongo(entity: TrainerDetailsEntity): Partial<ITrainerDetailsDocument> {
    return {
      user_id: new Types.ObjectId(entity.userId),
      bio: entity.bio,
      experience_year: entity.experienceYear,
      certifications: entity.certifications,
      specializations: entity.specializations,
      approval_status: entity.approvalStatus as "pending" | "approved" | "rejected"
    };
  }
}