import { SubmitSessionReportRequestDTO } from "@/application/dto/review/request/submit-session-report.dto";
import { SubmitSessionReportResponseDTO } from "@/application/dto/review/response/submit-session-report.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ISessionReportRepository } from "@/domain/interfaces/repositories/session-report.repository";
import { SessionReportEntity } from "@/domain/entities/review/session-report.entity";
import { REPORT_MESSAGES } from "@/domain/constants/messages.constants";

export class SubmitSessionReportUseCase implements IBaseUseCase<SubmitSessionReportRequestDTO, SubmitSessionReportResponseDTO> {
  constructor(
    private readonly _sessionReportRepository: ISessionReportRepository
  ) {}

  async execute(dto: SubmitSessionReportRequestDTO): Promise<SubmitSessionReportResponseDTO> {
    const existingReport = await this._sessionReportRepository.findByBookingId(dto.bookingId);
    if (existingReport) {
      throw new Error(REPORT_MESSAGES.ALREADY_REPORTED);
    }

    const report = new SessionReportEntity({
      bookingId: dto.bookingId,
      content: dto.content,
      metrics: dto.metrics,
      isPrivate: dto.isPrivate,
    });

    await this._sessionReportRepository.create(report);

    return {
      message: REPORT_MESSAGES.REPORT_FILED,
    };
  }
}
