import { ReportEntity } from "@/domain/entities/report/report.entity";
import { IReportRepository, IReportListItem, IReportSummary } from "@/domain/interfaces/repositories/report.repository";
import { ReportModel } from "../models/report.model";
import { ReportMapper, IReportDocument } from "../mappers/report.mapper";
import { BaseRepository } from "./base.repository";
import { ReportStatus, ReportType } from "@/domain/constants/report.constants";
import { PipelineStage, Types, Model } from "mongoose";

export class MongooseReportRepository 
    extends BaseRepository<ReportEntity, IReportDocument> 
    implements IReportRepository {
    
    constructor() {
        super(ReportModel as unknown as Model<IReportDocument>, new ReportMapper());
    }

    async findAllFiltered(params: {
        page: number;
        limit: number;
        status?: ReportStatus;
        type?: ReportType;
        search?: string;
    }): Promise<{ data: IReportListItem[]; total: number }> {
        const filter: Record<string, unknown> = {};
        if (params.status) filter.status = params.status;
        if (params.type) filter.type = params.type;

        const skip = (params.page - 1) * params.limit;


        const pipeline: PipelineStage[] = [
            { $match: filter as Record<string, unknown> },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "users",
                    localField: "reporterId",
                    foreignField: "_id",
                    as: "reporterData"
                }
            },
            { $unwind: { path: "$reporterData", preserveNullAndEmptyArrays: true } },
            ...(params.search ? [{
                $match: {
                    $or: [
                        { description: { $regex: params.search, $options: "i" } },
                        { "reporterData.firstName": { $regex: params.search, $options: "i" } },
                        { "reporterData.lastName": { $regex: params.search, $options: "i" } }
                    ]
                }
            }] : []),
            { $skip: skip },
            { $limit: params.limit },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedId",
                    foreignField: "_id",
                    as: "reportedInfo"
                }
            },
            { $unwind: { path: "$reportedInfo", preserveNullAndEmptyArrays: true } }
        ];

        const docs = await this.model.aggregate(pipeline);
        
        const totalResult = await this.model.aggregate([
            { $match: filter as Record<string, unknown> },
            {
                $lookup: {
                    from: "users",
                    localField: "reporterId",
                    foreignField: "_id",
                    as: "reporterData"
                }
            },
            { $unwind: { path: "$reporterData", preserveNullAndEmptyArrays: true } },
            ...(params.search ? [{
                $match: {
                    $or: [
                        { description: { $regex: params.search, $options: "i" } },
                        { "reporterData.firstName": { $regex: params.search, $options: "i" } },
                        { "reporterData.lastName": { $regex: params.search, $options: "i" } }
                    ]
                }
            }] : []),
            { $count: "count" }
        ]);

        const total = totalResult.length > 0 ? (totalResult[0] as Record<string, number>).count : 0;


        return {
            data: docs.map(doc => {
                interface IAggregateResult extends Omit<IReportListItem, "id" | "reporterId" | "reportedId"> {
                    _id: Types.ObjectId;
                    reporterId: Types.ObjectId;
                    reportedId: Types.ObjectId;
                    reporterData?: { firstName: string; lastName: string; role: string; profileImage?: string };
                    reportedInfo?: { firstName: string; lastName: string };
                }
                const res = doc as IAggregateResult;
                return {
                    id: res._id.toString(),
                    reporterId: res.reporterId.toString(),
                    reporter: {
                        name: res.reporterData ? `${res.reporterData.firstName} ${res.reporterData.lastName}` : "Unknown",
                        role: res.reporterData?.role === "trainer" ? "Trainer" : "User",
                        profileImage: res.reporterData?.profileImage || null
                    },
                    reportedId: res.reportedId.toString(),
                    reportedName: res.reportedInfo ? `${res.reportedInfo.firstName} ${res.reportedInfo.lastName}` : "System Case",
                    type: res.type,
                    status: res.status,
                    description: res.description,
                    resolutionNotes: res.resolutionNotes,
                    createdAt: res.createdAt,
                    updatedAt: res.updatedAt
                };
            }),
            total
        };
    }


    async updateStatus(id: string, status: ReportStatus, resolutionNotes?: string): Promise<ReportEntity | null> {
        const doc = await this.model.findByIdAndUpdate(
            id,
            { $set: { status, resolutionNotes } },
            { new: true }
        ).lean<IReportDocument>().exec();
        
        return doc ? this.mapper.toEntity(doc) : null;
    }

    async getSummary(): Promise<IReportSummary> {
        const result = await this.model.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: 1 },
                    pending: { $sum: { $cond: [{ $eq: ["$status", ReportStatus.PENDING] }, 1, 0] } },
                    resolved: { $sum: { $cond: [{ $eq: ["$status", ReportStatus.RESOLVED] }, 1, 0] } },
                    underReview: { $sum: { $cond: [{ $eq: ["$status", ReportStatus.UNDER_REVIEW] }, 1, 0] } },
                    dismissed: { $sum: { $cond: [{ $eq: ["$status", ReportStatus.DISMISSED] }, 1, 0] } }
                }
            }
        ]);

        if (result.length === 0) {
            return { total: 0, pending: 0, resolved: 0, underReview: 0, dismissed: 0 };
        }

        const summary = result[0] as IReportSummary;
        return {
            total: summary.total,
            pending: summary.pending,
            resolved: summary.resolved,
            underReview: summary.underReview,
            dismissed: summary.dismissed
        };
    }

    async findByIdWithDetails(id: string): Promise<IReportListItem | null> {
        const pipeline: PipelineStage[] = [
            { $match: { _id: new Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "users",
                    localField: "reporterId",
                    foreignField: "_id",
                    as: "reporterData"
                }
            },
            { $unwind: { path: "$reporterData", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users",
                    localField: "reportedId",
                    foreignField: "_id",
                    as: "reportedInfo"
                }
            },
            { $unwind: { path: "$reportedInfo", preserveNullAndEmptyArrays: true } }
        ];

        const docs = await this.model.aggregate(pipeline);
        if (docs.length === 0) return null;

        interface IDetailResult extends Omit<IReportListItem, "id" | "reporterId" | "reportedId"> {
            _id: Types.ObjectId;
            reporterId: Types.ObjectId;
            reportedId: Types.ObjectId;
            reporterData?: { firstName: string; lastName: string; role: string; profileImage?: string };
            reportedInfo?: { firstName: string; lastName: string };
        }
        const doc = docs[0] as IDetailResult;
        return {
            id: doc._id.toString(),
            reporterId: doc.reporterId.toString(),
            reporter: {
                name: doc.reporterData ? `${doc.reporterData.firstName} ${doc.reporterData.lastName}` : "Unknown",
                role: doc.reporterData?.role === "trainer" ? "Trainer" : "User",
                profileImage: doc.reporterData?.profileImage || null
            },
            reportedId: doc.reportedId.toString(),
            reportedName: doc.reportedInfo ? `${doc.reportedInfo.firstName} ${doc.reportedInfo.lastName}` : "System Case",
            type: doc.type,
            status: doc.status,
            description: doc.description,
            resolutionNotes: doc.resolutionNotes,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        };
    }

    async findBySessionAndReporter(sessionId: string, reporterId: string): Promise<ReportEntity | null> {
        const doc = await this.model.findOne({
            sessionId,
            reporterId: new Types.ObjectId(reporterId)
        }).lean<IReportDocument>().exec();

        return doc ? this.mapper.toEntity(doc) : null;
    }
}
