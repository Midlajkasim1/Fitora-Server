import { ITrainerRepository } from "@/domain/interfaces/repositories/onboarding/itrainer.repository";
import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { TrainerDetailsModel } from "../models/trainer-details.model";
import { TrainerDetailsMapper } from "../mappers/trainer-details.mapper";
import { UserMapper } from "../mappers/user.mapper";
import { Model, Types } from "mongoose";
import { ApprovalStatus } from "@/domain/constants/auth.constants";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { TrainerWithUser } from "@/domain/interfaces/repositories/onboarding/approveTrainer.interface";
import { UserModel } from "../models/user.models";
import { BaseRepository } from "./base.repository";
import { ITrainerDetailsDocument } from "../interfaces/trainer-details-document.interface";

export class TrainerRepository extends BaseRepository<TrainerDetailsEntity,ITrainerDetailsDocument> implements ITrainerRepository {
  constructor(
    private readonly trainerMapper: TrainerDetailsMapper,
    private readonly userMapper:UserMapper
  ) {
    super(TrainerDetailsModel as unknown as Model<ITrainerDetailsDocument>,trainerMapper);
   }
  

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

async findAllTrainers(params: {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  specialization?: string;
}): Promise<{ data: UserEntity[]; total: number }> {
  const { page, limit, search, status, specialization } = params;
  const skip = (page - 1) * limit;

  const trainerFilter: Record<string, unknown> = {
    approval_status: ApprovalStatus.APPROVED
  };

  if (specialization) {
    trainerFilter.specializations = specialization;
  }

  const userMatch: Record<string, unknown> = {};

  if (status) {
    userMatch.status = status;
  }

  if (search) {
    userMatch.$or = [
      { email: { $regex: search, $options: "i" } },
      { firstName: { $regex: search, $options: "i" } }
    ];
  }

  const docs = await TrainerDetailsModel.find(trainerFilter)
    .populate({
      path: "user_id",
      match: userMatch
    })
    .skip(skip)
    .limit(limit)
    .lean<TrainerWithUser[]>();

  const users = docs
    .filter(doc => doc.user_id!==null)
    .map(doc => this.userMapper.toEntity(doc.user_id!));

  return {
    data:users,
    total: users.length
  };
}


  async findById(id: string): Promise<TrainerDetailsEntity | null> {
    const doc = await TrainerDetailsModel.findById(id).lean();
    return doc ? this.trainerMapper.toEntity(doc) : null;
  }
  async findAllTrainerVerification(params: { page: number; limit: number; search?:string; approvalStatus?: string; }): Promise<{ data: TrainerDetailsEntity[]; total: number; }> {
    const { page, limit,search, approvalStatus } = params;
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (approvalStatus) {
      filter.approval_status = approvalStatus;
    }
     if (search) {
    const users = await UserModel.find({
      $or: [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
    }).select("_id");

    const userIds = users.map((u) => u._id);

    filter.user_id = { $in: userIds };
  }
    const [docs, total] = await Promise.all([
      TrainerDetailsModel.find(filter)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      TrainerDetailsModel.countDocuments(filter)
    ]);
    return {
      data: docs.map((doc) => this.trainerMapper.toEntity(doc)),
      total
    };
  }
  async updateApprovalStatus(id: string, status: ApprovalStatus, reason?: string): Promise<void> {
    await TrainerDetailsModel.findByIdAndUpdate(id, {
      $set: {
        approval_status: status,
        rejection_reason: status === "rejected" ? reason : null,
        verified: status === "approved"
      }
    });
  }
  async findApprovedTrainer(): Promise<string[]> {
    const docs = await TrainerDetailsModel.find({
      approval_status: ApprovalStatus.APPROVED
    })
      .select("user_id")
      .lean();

    return docs.map(doc => doc.user_id.toString());
  }
  async findTrainerIdsBySpecializations(specializationIds: string[]): Promise<string[]> {
    const mongoIds = specializationIds.map(id => new Types.ObjectId(id));
    
    const docs = await TrainerDetailsModel.find({
        specializations: { $in: mongoIds },
        approval_status: "approved"
    }).select("user_id").lean().exec();
    return docs.map(doc => doc.user_id.toString());
}

}