import { ISessionReportRepository } from "@/domain/interfaces/repositories/session-report.repository";
import { SessionReportEntity } from "@/domain/entities/review/session-report.entity";
import { SessionReportModel } from "../models/session-report.model";
import { SessionReportMapper } from "../mappers/session-report.mapper";
import { BaseRepository } from "./base.repository";
import mongoose, { Model } from "mongoose";
import { ISessionReportDocument } from "../interfaces/session-report-document.interface";

export class MongooseSessionReportRepository
  extends BaseRepository<SessionReportEntity, ISessionReportDocument>
  implements ISessionReportRepository
{
  constructor() {
    super(SessionReportModel as unknown as Model<ISessionReportDocument>, new SessionReportMapper());
  }

  async findByBookingId(bookingId: string): Promise<SessionReportEntity | null> {
    const doc = await this.model.findOne({ booking_id: new mongoose.Types.ObjectId(bookingId) }).lean<ISessionReportDocument>();
    return doc ? this.mapper.toEntity(doc) : null;
  }
}
