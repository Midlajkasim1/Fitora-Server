import { SlotEntity } from "@/domain/entities/slot/slot.entity";
import { BaseRepository } from "./base.repository";
import { ISlotDocument } from "../interfaces/slot-document.interface";
import { SlotMapper } from "../mappers/slot.mapper";
import { SlotModel } from "../models/slots.models";
import { Model, Types, PipelineStage } from "mongoose";
import { IAggregateSlot, ISlotRepository, ISlotWithTrainer, ITrainerParticipantRow, ITrainerParticipantsResult, ITrainerUpcomingResult, IUpcomingSlot, IUserUpcomingResult, IUserUpcomingSlot } from "@/domain/interfaces/repositories/slot.repository";
import { SessionType, SlotStatus } from "@/domain/constants/session.constants";

export class SlotRespository extends BaseRepository<SlotEntity, ISlotDocument> implements ISlotRepository {
    constructor(
        private readonly _slotMapper: SlotMapper
    ) {
        super(SlotModel as unknown as Model<ISlotDocument>, _slotMapper);
    }
    async findOverlappingSlot(trainerId: string, startTime: Date, endTime: Date): Promise<SlotEntity | null> {
        const doc = await SlotModel.findOne({
            trainerId: new Types.ObjectId(trainerId),
            status: { $ne: SlotStatus.CANCELLED },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        }).lean();
        return doc ? this._slotMapper.toEntity(doc as ISlotDocument) : null;
    }


    // async findAvailableSlotsByTrainers(params:{trainerIds: string[];skip:number;limit:number;search?:string}): Promise<{slots:ISlotWithTrainer[],total:number}> {
    //     const {trainerIds,skip,limit,search} = params;
    //     const trainerids = trainerIds.map(id => new Types.ObjectId(id));
    //     const now = new Date();
    //     const docs = await SlotModel.aggregate<IAggregateSlot>([
    //         {
    //             $match: {
    //                 trainerId: { $in: trainerids },
    //                 status: SlotStatus.AVAILABLE,
    //                 startTime: { $gt: now }
    //             }
    //         },
    //         {
    //             $lookup: {
    //                 from: "users",
    //                 localField: "trainerId",
    //                 foreignField: "_id",
    //                 as: "trainerInfo"
    //             }
    //         },
    //         { $unwind: { path: "$trainerInfo", preserveNullAndEmptyArrays: true } },


    //     ]);
    //     return docs.map((doc) => ({
    //         id: doc._id.toString(),
    //         trainerId: doc.trainerId.toString(),
    //         trainerName: `${doc.trainerInfo.firstName} ${doc.trainerInfo.lastName}`,
    //         startTime: doc.startTime,
    //         endTime: doc.endTime,
    //         type: doc.type,
    //         capacity: doc.capacity,
    //         participants: doc.participants.map(p => p.toString()),
    //         status: doc.status
    //     }));
    // }
    async findAvailableSlotsByTrainers(params: { trainerIds: string[]; skip: number; limit: number; search?: string;type?:SessionType }): Promise<{ slots: ISlotWithTrainer[]; total: number; }> {
        const { trainerIds, skip, limit, search,type } = params;
        const trainerobjIds = trainerIds.map(id => new Types.ObjectId(id));
        const now = new Date();
        const filter: Record<string, unknown> = {
            trainerId: { $in: trainerobjIds },
            status: SlotStatus.AVAILABLE,
            startTime: { $gt: now }
        };
        if (type) {
        filter.type = type;
    }
        const total = await SlotModel.countDocuments(filter);
        const pipeline: PipelineStage[] = [
            { $match: filter },
            {
                $lookup: {
                    from: "users",
                    localField: "trainerId",
                    foreignField: "_id",
                    as: "trainerInfo"
                }
            },
            { $unwind: "$trainerInfo" }
        ];
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { "trainerInfo.firstName": { $regex: search, $options: "i" } },
                        { "trainerInfo.lastName": { $regex: search, $options: "i" } }
                    ]
                }
            });
        }
        pipeline.push(
            { $sort: { startTime: 1 } },
            { $skip: skip },
            { $limit: limit }
        );
        const docs = await SlotModel.aggregate<IAggregateSlot>(pipeline);

        const slots = docs.map((doc) => ({
            id: doc._id.toString(),
            trainerId: doc.trainerId.toString(),
            trainerName: `${doc.trainerInfo.firstName} ${doc.trainerInfo.lastName}`,
            startTime: doc.startTime,
            endTime: doc.endTime,
            type: doc.type,
            capacity: doc.capacity,
            participants: doc.participants.map(p => p.toString()),
            status: doc.status
        }));

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
            {
                _id: new Types.ObjectId(slotId),
                participants: new Types.ObjectId(userId),
                status: { $in: [SlotStatus.AVAILABLE, SlotStatus.BOOKED] }
            },
            {
                $pull: { participants: new Types.ObjectId(userId) },
                $set: { status: SlotStatus.AVAILABLE }
            }
        );
        return result.modifiedCount > 0;
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

    async getTrainerParticipants(params: {
        trainerId: string;
        type: SessionType;
        skip: number;
        limit: number;
        search?: string;
    }): Promise<ITrainerParticipantsResult> {
        const { trainerId, type, skip, limit, search } = params;

        const pipeline: PipelineStage[] = [
            {
                $match: {
                    trainerId: new Types.ObjectId(trainerId),
                    type: type,
                    status: { $in: [SlotStatus.BOOKED, SlotStatus.COMPLETED, SlotStatus.AVAILABLE] }
                }
            },
            { $unwind: "$participants" },
            {
                $lookup: {
                    from: "users",
                    localField: "participants",
                    foreignField: "_id",
                    as: "participantInfo",
                },
            },
            { $unwind: "$participantInfo" }
        ];

        if (search) {
            pipeline.push({
                $match: {
                    "participantInfo.firstName": { $regex: search, $options: "i" },

                }
            });
        }

        pipeline.push(
            { $sort: { startTime: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    slotId: "$_id",
                    startTime: 1,
                    status: 1,
                    userId: "$participantInfo._id",
                    firstName: "$participantInfo.firstName",
                    lastName: "$participantInfo.lastName",
                    email: "$participantInfo.email",
                    profileImage: "$participantInfo.profileImage"
                }
            }
        );

        const data = await SlotModel.aggregate<ITrainerParticipantRow>(pipeline);

        // const total = await SlotModel.countDocuments({ 
        //     trainerId: new Types.ObjectId(trainerId),
        //     type: type,
        //     participants: { $exists: true, $not: { $size: 0 } }
        // });
        const totalResult = await SlotModel.aggregate([
            {
                $match: {
                    trainerId: new Types.ObjectId(trainerId),
                    type: type,
                    status: { $ne: SlotStatus.CANCELLED },
                    participants: { $exists: true, $not: { $size: 0 } }
                }
            },
            {
                $group: {
                    _id: null,
                    totalParticipants: { $sum: { $size: "$participants" } }
                }
            }
        ]);

        const total = totalResult.length > 0 ? totalResult[0].totalParticipants : 0;

        return { data, total };
    };

    async getTrainerUpcomingSlots(params: { trainerId: string; skip: number; limit: number; }): Promise<ITrainerUpcomingResult> {
        const { trainerId, skip, limit } = params;
        const now = new Date();
        const filterByUpcoming = {
            trainerId: new Types.ObjectId(trainerId),
            startTime: { $gte: now },
            status: { $ne: SlotStatus.CANCELLED }
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
            startTime: { $gte: now },
            status: { $ne: SlotStatus.CANCELLED }
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
                    trainerId: "$trainerDetails._id",
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
            { $match: { trainerId: new Types.ObjectId(trainerId) } },
            { $unwind: "$participants" },
            { $group: { _id: "$participants" } },
            { $count: "total" }
        ]);
        return result[0]?.total || 0;
    }

    async checkAvaliability(trainerId: string, startTime: Date, endTime: Date, excludeId?: string): Promise<SlotEntity | null> {
        const data: Record<string, unknown> = {
            trainerId: new Types.ObjectId(trainerId),
            status: { $ne: SlotStatus.CANCELLED },
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
        };
        if (excludeId) {
            data._id = { $ne: new Types.ObjectId(excludeId) };
        }
        const doc = await SlotModel.findOne(data).lean();
        return doc ? this._slotMapper.toEntity(doc) : null;
    }
}