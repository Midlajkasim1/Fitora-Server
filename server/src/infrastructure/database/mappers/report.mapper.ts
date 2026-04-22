import { ReportEntity } from "@/domain/entities/report/report.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { Types } from "mongoose";
import { ReportStatus, ReportType } from "@/domain/constants/report.constants";

export interface IReportDocument {
    _id: Types.ObjectId;
    reporterId: Types.ObjectId;
    reportedId: Types.ObjectId;
    type: ReportType;
    status: ReportStatus;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export class ReportMapper implements IMapper<ReportEntity, IReportDocument> {
    toEntity(doc: IReportDocument): ReportEntity {
        return new ReportEntity({
            id: doc._id.toString(),
            reporterId: doc.reporterId.toString(),
            reportedId: doc.reportedId.toString(),
            type: doc.type,
            status: doc.status,
            description: doc.description,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt
        });
    }

    toMongo(entity: ReportEntity): Partial<IReportDocument> {
        return {
            reporterId: new Types.ObjectId(entity.reporterId),
            reportedId: new Types.ObjectId(entity.reportedId),
            type: entity.type,
            status: entity.status,
            description: entity.description
        };
    }
}
