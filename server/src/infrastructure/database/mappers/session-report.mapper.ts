import { SessionReportEntity, ISessionMetrics } from "@/domain/entities/review/session-report.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { ISessionReportDocument } from "../interfaces/session-report-document.interface";
import { Types } from "mongoose";

export class SessionReportMapper implements IMapper<SessionReportEntity, ISessionReportDocument> {
  toEntity(doc: ISessionReportDocument): SessionReportEntity {
    return new SessionReportEntity({
      id: doc._id.toString(),
      bookingId: doc.booking_id.toString(),
      content: doc.content,
      metrics: doc.metrics as ISessionMetrics, 
      isPrivate: doc.is_private
    });
  }

  toMongo(entity: SessionReportEntity): Partial<ISessionReportDocument> {
    return {
      booking_id: new Types.ObjectId(entity.bookingId),
      content: entity.content,
      metrics: entity.metrics as Record<string, unknown>,
      is_private: entity.isPrivate
    };
  }
}
