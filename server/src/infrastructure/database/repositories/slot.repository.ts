import { SessionType, SlotStatus } from "@/domain/constants/session.constants";
import { ISlotRepository, ITrainerUpcomingResult, IUserUpcomingResult, IUpcomingSlot, IUserUpcomingSlot, ISlotWithTrainer, IChatPartner, ITrainerParticipantRow } from "@/domain/interfaces/repositories/slot.repository";
import { PipelineStage, Types, Model } from "mongoose";
import { SlotModel } from "../models/slots.models";
import { SlotMapper } from "../mappers/slot.mapper";
import { SlotEntity } from "@/domain/entities/slot/slot.entity";
import { ISlotDocument } from "../interfaces/slot-document.interface";
import { BaseRepository } from "./base.repository";

export class SlotRepository extends BaseRepository<SlotEntity, ISlotDocument> implements ISlotRepository {
    constructor(private readonly _slotMapper: SlotMapper) {
        super(SlotModel as unknown as Model<ISlotDocument>, _slotMapper);
    }


    async findByTrainerAndPeriod(trainerId: string, start: Date, end: Date): Promise<SlotEntity[]> {
        const docs = await SlotModel.find({
            trainerId: new Types.ObjectId(trainerId),
            $or: [
                { startTime: { $lt: end, $gte: start } },
                { endTime: { $gt: start, $lte: end } }
            ],
            status: { $ne: SlotStatus.CANCELLED }
        }).lean<ISlotDocument[]>();
        return docs.map(doc => this._slotMapper.toEntity(doc));
    }

    async findAvailableSlotsByTrainers(params: {
        trainerIds: string[];
        skip: number;
        limit: number;
        search?: string;
        type?: SessionType;
    }): Promise<{ slots: ISlotWithTrainer[], total: number }> {
        const { trainerIds, skip, limit, search, type } = params;
        const now = new Date();

        const filter: Record<string, unknown> = {
            status: SlotStatus.AVAILABLE,
            startTime: { $gt: now },
            trainerId: { $in: trainerIds.map(id => new Types.ObjectId(id)) },
            $expr: { $lt: [{ $size: "$participants" }, "$capacity"] }
        };

        if (type) {
            filter.type = type;
        }

        const pipeline: PipelineStage[] = [
            { $match: filter as Record<string, unknown> },
            {
                $lookup: {
                    from: "users",
                    localField: "trainerId",
                    foreignField: "_id",
                    as: "trainer"
                }
            },
            { $unwind: "$trainer" }
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "trainer.firstName": { $regex: search, $options: "i" } },
                        { "trainer.lastName": { $regex: search, $options: "i" } }
                    ]
                }
            });
        }

        pipeline.push(
            { $sort: { startTime: 1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    trainerId: { $toString: "$trainerId" },
                    trainerName: { $concat: ["$trainer.firstName", " ", "$trainer.lastName"] },
                    startTime: 1,
                    endTime: 1,
                    type: 1,
                    capacity: 1,
                    participants: { $map: { input: "$participants", as: "p", in: { $toString: "$$p" } } },
                    status: 1
                }
            }
        );

        const slots = await SlotModel.aggregate<ISlotWithTrainer>(pipeline);
        
        const totalResult = await SlotModel.aggregate([
            { $match: filter as Record<string, unknown> },
            {
                $lookup: {
                    from: "users",
                    localField: "trainerId",
                    foreignField: "_id",
                    as: "trainer"
                }
            },
            { $unwind: "$trainer" },
            ...(search ? [{
                $match: {
                    $or: [
                        { "trainer.firstName": { $regex: search, $options: "i" } },
                        { "trainer.lastName": { $regex: search, $options: "i" } }
                    ]
                }
            }] : []),
            { $count: "count" }
        ]);

        const total = totalResult.length > 0 ? (totalResult[0] as Record<string, number>).count : 0;
        return { slots, total };
    }

    async bookSlot(slotId: string, userId: string): Promise<boolean> {
        const result = await SlotModel.updateOne(
            {
                _id: new Types.ObjectId(slotId),
                status: SlotStatus.AVAILABLE,
                $expr: { $lt: [{ $size: "$participants" }, "$capacity"] }
            },
            {
                $addToSet: { participants: new Types.ObjectId(userId) }
            }
        );
        return result.modifiedCount > 0;
    }

    async cancelBooking(slotId: string, userId: string): Promise<boolean> {
        const result = await SlotModel.updateOne(
            { _id: new Types.ObjectId(slotId) },
            { $pull: { participants: new Types.ObjectId(userId) } }
        );
        return result.modifiedCount > 0;
    }

    async deleteSlot(slotId: string): Promise<boolean> {
        const result = await SlotModel.deleteOne({
            _id: new Types.ObjectId(slotId),
            participants: { $size: 0 }
        });
        return result.deletedCount > 0;
    }

    async updateStatus(slotId: string, status: SlotStatus): Promise<void> {
        await SlotModel.findByIdAndUpdate(slotId, { $set: { status: status } });
    }

    async completeSession(slotId: string): Promise<boolean> {
        const result = await SlotModel.updateOne(
            {
                _id: new Types.ObjectId(slotId),
                status: { $ne: SlotStatus.CANCELLED }
            },
            { $set: { status: SlotStatus.COMPLETED } }
        );
        return result.modifiedCount > 0;
    }

    async getTrainerUpcomingSlots(params: { trainerId: string; skip: number; limit: number; }): Promise<ITrainerUpcomingResult> {
        const { trainerId, skip, limit } = params;
        const now = new Date();

        const filterByUpcoming = {
            trainerId: new Types.ObjectId(trainerId),
            $or: [
                { status: SlotStatus.LIVE },
                { 
                    status: SlotStatus.COMPLETED,
                    endTime: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                },
                { 
                    status: { $in: [SlotStatus.BOOKED, SlotStatus.AVAILABLE] },
                    endTime: { $gt: now }
                }
            ]
        };


        const pipeline: PipelineStage[] = [
            { $match: filterByUpcoming },
            { $sort: { startTime: 1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    slotId: "$_id",
                    startTime: 1,
                    endTime: 1,
                    type: 1,
                    status: 1,
                    capacity: 1,
                    bookedCount: { $size: { $ifNull: ["$participants", []] } }
                }
            }
        ];
        const data = await SlotModel.aggregate<IUpcomingSlot>(pipeline);
        const total = await SlotModel.countDocuments(filterByUpcoming);
        return { data, total };
    }

    async getUserUpcomingSlots(params: { userId: string; skip: number; limit: number; }): Promise<IUserUpcomingResult> {
        const { userId, skip, limit } = params;
        const now = new Date();

        const userUpcomingFilter = {
            participants: new Types.ObjectId(userId),
            $or: [
                { status: SlotStatus.LIVE },
                { 
                    status: SlotStatus.COMPLETED,
                    endTime: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
                },
                { 
                    status: { $in: [SlotStatus.BOOKED, SlotStatus.AVAILABLE] },
                    endTime: { $gt: now }
                }
            ]
        };


        const pipeline: PipelineStage[] = [
            { $match: userUpcomingFilter },
            {
                $lookup: {
                    from: "users",
                    localField: "trainerId",
                    foreignField: "_id",
                    as: "trainerDetails"
                }
            },
            { $unwind: "$trainerDetails" },
            { $sort: { startTime: 1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    slotId: "$_id",
                    startTime: 1,
                    endTime: 1,
                    type: 1,
                    status: 1,
                    trainerId: { $toString: "$trainerDetails._id" },
                    trainerName: { $concat: ["$trainerDetails.firstName", " ", "$trainerDetails.lastName"] },
                    trainerProfile: "$trainerDetails.profileImage"
                }
            }
        ];

        const data = await SlotModel.aggregate<IUserUpcomingSlot>(pipeline);
        const total = await SlotModel.countDocuments(userUpcomingFilter);

        return { data, total };
    }

    async getTotalClients(trainerId: string): Promise<number> {
        const result = await SlotModel.aggregate([
            { $match: { trainerId: new Types.ObjectId(trainerId), status: SlotStatus.COMPLETED } },
            { $unwind: "$participants" },
            { $group: { _id: "$participants" } },
            { $count: "count" }
        ]);
        return result.length > 0 ? (result[0] as Record<string, number>).count : 0;
    }

    async checkAvaliability(trainerId: string, startTime: Date, endTime: Date, excludeId?: string): Promise<SlotEntity | null> {
        const query: Record<string, unknown> = {
            trainerId: new Types.ObjectId(trainerId),
            status: { $ne: SlotStatus.CANCELLED },
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        };
        if (excludeId) query._id = { $ne: new Types.ObjectId(excludeId) };
        const doc = await SlotModel.findOne(query).lean<ISlotDocument>();
        return doc ? this._slotMapper.toEntity(doc) : null;
    }
    
    async findOverlappingSlot(trainerId: string, startTime: Date, endTime: Date): Promise<SlotEntity | null> {
        return this.checkAvaliability(trainerId, startTime, endTime);
    }

    async findUserOverlappingSlot(userId: string, startTime: Date, endTime: Date): Promise<SlotEntity | null> {
        const doc = await SlotModel.findOne({
            participants: new Types.ObjectId(userId),
            status: { $ne: SlotStatus.CANCELLED },
            $or: [
                { startTime: { $lt: endTime, $gte: startTime } },
                { endTime: { $gt: startTime, $lte: endTime } }
            ]
        }).lean<ISlotDocument>();
        return doc ? this._slotMapper.toEntity(doc) : null;
    }

    async getTrainerParticipants(params: { trainerId: string, type: SessionType, skip: number, limit: number, search?: string }): Promise<{ data: ITrainerParticipantRow[], total: number }> {
        const { trainerId, type, skip, limit, search } = params;

        const matchStage: Record<string, unknown> = {
            trainerId: new Types.ObjectId(trainerId),
            type,
            status: { $ne: SlotStatus.CANCELLED }
        };

        const pipeline: PipelineStage[] = [
            { $match: matchStage as Record<string, unknown> },
            { $unwind: "$participants" },
            {
                $group: {
                    _id: "$participants",
                    totalBookedSlots: { $sum: 1 },
                    lastSessionTime: { $max: "$startTime" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" }
        ];

        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "userDetails.firstName": { $regex: search, $options: "i" } },
                        { "userDetails.lastName": { $regex: search, $options: "i" } },
                        { "userDetails.email": { $regex: search, $options: "i" } }
                    ]
                }
            });
        }

        const totalPipeline = [...pipeline, { $count: "total" }];
        const totalResult = await SlotModel.aggregate(totalPipeline);
        const total = totalResult[0] ? (totalResult[0] as Record<string, number>).total : 0;

        pipeline.push(
            { $sort: { lastSessionTime: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    userId: { $toString: "$_id" },
                    totalBookedSlots: 1,
                    lastSessionTime: 1,
                    firstName: "$userDetails.firstName",
                    lastName: "$userDetails.lastName",
                    email: "$userDetails.email",
                    profileImage: "$userDetails.profileImage"
                }
            }
        );

        const data = await SlotModel.aggregate(pipeline);
        return { data: data as ITrainerParticipantRow[], total };
    }

    async findAvailableSlots(params: { userId?: string, trainerId?: string, page: number, limit: number, search?: string }): Promise<{ slots: ISlotWithTrainer[], total: number }> {
        const { trainerId, page, limit, search } = params;
        return this.findAvailableSlotsByTrainers({
            trainerIds: trainerId ? [trainerId] : [],
            skip: (page - 1) * limit,
            limit,
            search
        });
    }

    async getClientSessionHistory(trainerId: string, clientId: string): Promise<SlotEntity[]> {
        const docs = await SlotModel.find({
            trainerId: new Types.ObjectId(trainerId),
            participants: new Types.ObjectId(clientId),
            status: { $ne: SlotStatus.CANCELLED }
        }).sort({ startTime: -1 }).lean<ISlotDocument[]>();
        return docs.map(doc => this._slotMapper.toEntity(doc));
    }

    async hasActiveOrRecentBooking(userAId: string, userBId: string, gracePeriodLimit: Date): Promise<boolean> {
        const count = await SlotModel.countDocuments({
            $or: [
                { trainerId: new Types.ObjectId(userAId), participants: new Types.ObjectId(userBId) },
                { trainerId: new Types.ObjectId(userBId), participants: new Types.ObjectId(userAId) }
            ],
            status: { $ne: SlotStatus.CANCELLED },
            endTime: { $gt: gracePeriodLimit }
        });
        return count > 0;
    }

    async findActiveChatPartners(userId: string, gracePeriodLimit: Date): Promise<IChatPartner[]> {
        const result = await SlotModel.aggregate([
            {
                $match: {
                    participants: new Types.ObjectId(userId),
                    status: { $ne: SlotStatus.CANCELLED },
                    endTime: { $gt: gracePeriodLimit }
                }
            },
            {
                $group: { _id: "$trainerId" }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "trainer"
                }
            },
            { $unwind: "$trainer" },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$trainer._id" },
                    name: { $concat: ["$trainer.firstName", " ", "$trainer.lastName"] },
                    profileImage: "$trainer.profileImage"
                }
            }
        ]);
        return result as IChatPartner[];
    }

    async findActiveChatPartnersForTrainer(trainerId: string, gracePeriodLimit: Date): Promise<IChatPartner[]> {
        const result = await SlotModel.aggregate([
            {
                $match: {
                    trainerId: new Types.ObjectId(trainerId),
                    status: { $ne: SlotStatus.CANCELLED },
                    endTime: { $gt: gracePeriodLimit }
                }
            },
            { $unwind: "$participants" },
            { $group: { _id: "$participants" } },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "participant"
                }
            },
            { $unwind: "$participant" },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$participant._id" },
                    name: { $concat: ["$participant.firstName", " ", "$participant.lastName"] },
                    profileImage: "$participant.profileImage"
                }
            }
        ]);
        return result as IChatPartner[];
    }

    async countActiveSessions(): Promise<number> {
        return await SlotModel.countDocuments({ status: SlotStatus.LIVE });
    }
}