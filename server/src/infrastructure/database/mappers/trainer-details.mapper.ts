import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { ITrainerDetailsDocument } from "../interfaces/trainer-details-document.interface";
import { Types } from "mongoose";
import { ApprovalStatus } from "@/domain/enum/user/trainer-details.enum";

export class TrainerDetailsMapper {
  static toEntity(doc: ITrainerDetailsDocument): TrainerDetailsEntity {
    return new TrainerDetailsEntity({
      id: doc._id.toString(),
      userId: doc.user_id.toString(),
      bio: doc.bio,
      experienceYear: doc.experience_year,
      certifications: doc.certifications,
      specializations: doc.specializations.map((item) => item.toString()),
      approvalStatus: doc.approval_status as ApprovalStatus
    });
  }

  static toMongo(entity: TrainerDetailsEntity): Partial<ITrainerDetailsDocument> {
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