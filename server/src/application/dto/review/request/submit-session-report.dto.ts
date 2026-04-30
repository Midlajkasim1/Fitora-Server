import { ISessionMetrics } from "@/domain/entities/review/session-report.entity";

export interface SubmitSessionReportRequestDTO {
  bookingId: string;
  content: string;
  metrics: ISessionMetrics;
  isPrivate: boolean;
}
