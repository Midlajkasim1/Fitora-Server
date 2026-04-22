import { SessionReportEntity } from "@/domain/entities/review/session-report.entity";
import { IBaseRepository } from "./base.repository";

export interface ISessionReportRepository extends IBaseRepository<SessionReportEntity> {
  findByBookingId(bookingId: string): Promise<SessionReportEntity | null>;
}
