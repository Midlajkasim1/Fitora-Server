import { ApprovalStatus } from "@/domain/constants/auth.constants";
import { TrainerDetailsEntity } from "@/domain/entities/user/trainer-details.entity";
import { UserEntity } from "@/domain/entities/user/user.entity";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { TrainerWithUser } from "@/domain/interfaces/repositories/onboarding/approveTrainer.interface";
import { Model, PipelineStage, Types } from "mongoose";
import { ITrainerDetailsDocument } from "../interfaces/trainer-details-document.interface";
import { TrainerDetailsMapper } from "../mappers/trainer-details.mapper";
import { UserMapper } from "../mappers/user.mapper";
import { TrainerDetailsModel } from "../models/trainer-details.model";
import { UserModel } from "../models/user.models";
import { BaseRepository } from "./base.repository";

interface ITrainerBookingResult {
  user_id: Types.ObjectId;
  userInfo: {
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  specializations: string[];
  experience: number;
  rating: number;
  bio: string;
  availableSlotsCount: number;
}

export class TrainerRepository extends BaseRepository<TrainerDetailsEntity, ITrainerDetailsDocument> implements ITrainerRepository {
  constructor(
    private readonly trainerMapper: TrainerDetailsMapper,
    private readonly userMapper: UserMapper
  ) {
    super(TrainerDetailsModel as unknown as Model<ITrainerDetailsDocument>, trainerMapper);
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
    }).lean<ITrainerDetailsDocument>();

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
    const matchedUsers = await UserModel.find(userMatch).select("_id").lean();
    const matchedUserIds = matchedUsers.map(u => u._id);
    trainerFilter.user_id = { $in: matchedUserIds };

    const [docs, totalCount] = await Promise.all([
      TrainerDetailsModel.find(trainerFilter)
        .populate("user_id")
        .skip(skip)
        .limit(limit)
        .lean<TrainerWithUser[]>(),
      TrainerDetailsModel.countDocuments(trainerFilter)
    ]);

    const users = docs
      .filter(doc => doc.user_id !== null)
      .map(doc => this.userMapper.toEntity(doc.user_id!));

    return {
      data: users,
      total: totalCount
    };
  }


  async findById(id: string): Promise<TrainerDetailsEntity | null> {
    const doc = await TrainerDetailsModel.findById(id).lean<ITrainerDetailsDocument>();
    return doc ? this.trainerMapper.toEntity(doc) : null;
  }

  async findAllTrainerVerification(params: { page: number; limit: number; search?: string; approvalStatus?: string; }): Promise<{ data: TrainerDetailsEntity[]; total: number; }> {
    const { page, limit, search, approvalStatus } = params;
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
        .lean<ITrainerDetailsDocument[]>(),
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

  async updateRating(trainerId: string, averageRating: number, reviewCount: number): Promise<void> {
    await TrainerDetailsModel.findOneAndUpdate(
      { user_id: new Types.ObjectId(trainerId) },
      {
        $set: {
          rating: averageRating,
          total_reviews: reviewCount
        }
      }
    );
  }
  async findApprovedTrainer(): Promise<string[]> {
    const docs = await TrainerDetailsModel.find({
      approval_status: ApprovalStatus.APPROVED
    })
      .select("user_id")
      .lean<{ user_id: Types.ObjectId }[]>();

    return docs.map(doc => doc.user_id.toString());
  }
  async findTrainerIdsBySpecializations(specializationIds: string): Promise<string[]> {

    const docs = await TrainerDetailsModel.find({
      specializations: specializationIds,
      approval_status: "approved"
    }).select("user_id").lean<{ user_id: Types.ObjectId }[]>().exec();
    return docs.map(doc => doc.user_id.toString());
  }

  async findTrainerForBooking(params: { trainerIds: string[]; search?: string; skip: number; limit: number; }): Promise<{ data: Record<string, unknown>[]; total: number; }> {
    const { trainerIds, search, skip, limit } = params;

    const trainerObjectIds = trainerIds.map(id => new Types.ObjectId(id));

    const filter: Record<string, unknown> = {
      user_id: { $in: trainerObjectIds },
      approval_status: "approved"
    };

    const pipeline: PipelineStage[] = [
      { $match: filter as Record<string, unknown> },
      {
        $lookup: {
          from: "users",
          localField: "user_id",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $lookup: {
          from: "slots",
          let: { tId: "$user_id" },
          pipeline: [
            { 
              $match: { 
                $expr: { 
                  $and: [
                    { $eq: ["$trainerId", "$$tId"] },
                    { $eq: ["$status", "available"] },
                    { $gt: ["$startTime", new Date()] },
                    { $lt: [{ $size: "$participants" }, "$capacity"] }
                  ]
                }
              }
            },
            { $count: "count" }
          ],
          as: "availableSlots"
        }
      },
      {
        $addFields: {
          availableSlotsCount: { 
            $ifNull: [{ $arrayElemAt: ["$availableSlots.count", 0] }, 0] 
          }
        }
      }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { "userInfo.firstName": { $regex: search, $options: "i" } },
            { "userInfo.lastName": { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    const totalResults = await TrainerDetailsModel.aggregate([...pipeline, { $count: "total" }]);
    const total = (totalResults[0] as { total: number } | undefined)?.total || 0;

    pipeline.push({ $sort: { availableSlotsCount: -1 } }); // Show active trainers first
    pipeline.push({ $skip: skip }, { $limit: limit });

    const docs = await TrainerDetailsModel.aggregate<ITrainerBookingResult>(pipeline);

    const data = docs.map(doc => ({
      trainerId: doc.user_id.toString(),
      name: `${doc.userInfo.firstName} ${doc.userInfo.lastName}`,
      profileImage: doc.userInfo.profileImage,
      specializations: doc.specializations,
      experience: doc.experience,
      rating: doc.rating,
      bio: doc.bio,
      availableSlotsCount: doc.availableSlotsCount
    }));

    return { data, total };
  }
  async findByTrainerId(trainerId: string): Promise<TrainerDetailsEntity | null> {
    const doc = await TrainerDetailsModel.findOne({
      user_id: new Types.ObjectId(trainerId)
    }).lean<ITrainerDetailsDocument>();
    return doc ? this.trainerMapper.toEntity(doc) : null;
  }

  async updateWalletBalance(userId: string, amount: number): Promise<void> {
    await TrainerDetailsModel.findOneAndUpdate(
      { user_id: new Types.ObjectId(userId) },
      { $inc: { wallet_balance: amount } }
    );
  }

}