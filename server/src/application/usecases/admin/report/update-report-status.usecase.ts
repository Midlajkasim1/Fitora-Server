import { UpdateReportStatusRequestDTO } from "@/application/dto/admin/request/update-report-status.dto";
import { ReportResponseDTO } from "@/application/dto/report/response/report-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IReportRepository } from "@/domain/interfaces/repositories/report.repository";
import { ReportStatus, ReportType } from "@/domain/constants/report.constants";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { IEmailService } from "@/domain/interfaces/services/email-service.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { REPORT_MESSAGES } from "@/domain/constants/messages.constants";

export class UpdateReportStatusUseCase implements IBaseUseCase<UpdateReportStatusRequestDTO, ReportResponseDTO> {
    constructor(
        private readonly _reportRepository: IReportRepository,
        private readonly _socketEmitter: ISocketEmitter,
        private readonly _userRepository: IUserRepository,
        private readonly _emailService: IEmailService
    ) {}

    async execute(dto: UpdateReportStatusRequestDTO): Promise<ReportResponseDTO> {
        const report = await this._reportRepository.findById(dto.reportId);
        if (!report) {
            throw new Error(REPORT_MESSAGES.REPORT_NOT_FOUND);
        }

        const updatedReport = await this._reportRepository.updateStatus(dto.reportId, dto.status, dto.resolutionNotes);
        if (!updatedReport) {
            throw new Error(REPORT_MESSAGES.REPORT_UPDATE_FAILED);
        }

        if (dto.status === ReportStatus.RESOLVED) {
            if (report.type === ReportType.MISCONDUCT) {
                this._socketEmitter.emitToRoom(report.reportedId, "CRITICAL_NOTICE", {
                    type: "MISCONDUCT_RESOLUTION",
                    message: "A misconduct report against you has been resolved. Your account is now under administrative review.",
                    reportId: report.id
                });
                
    
            }

            if (report.description.toLowerCase().includes("not showing up") || report.description.toLowerCase().includes("absent")) {
                this._socketEmitter.emitToRoom(report.reporterId, "PAYMENT_NOTIFICATION", {
                    type: "REFUND_PROCESSED",
                    message: "Your report regarding trainer absence has been resolved. A session credit has been refunded to your account.",
                    reportId: report.id
                });
            }

            this._socketEmitter.emitToRoom(report.reporterId, "REPORT_UPDATE", {
                status: ReportStatus.RESOLVED,
                message: "Your report has been reviewed and resolved by our administration team."
            });

            const reporter = await this._userRepository.findById(report.reporterId);
            if (reporter) {
                this._emailService.sendReportUpdateEmail(
                    reporter.email, 
                    `${reporter.firstName} ${reporter.lastName}`,
                    ReportStatus.RESOLVED,
                    dto.resolutionNotes || "Admin has concluded the review and resolved the incident."
                );
            }

        } else if (dto.status === ReportStatus.DISMISSED) {
            this._socketEmitter.emitToRoom(report.reporterId, "REPORT_UPDATE", {
                status: ReportStatus.DISMISSED,
                message: "Your report has been reviewed but dismissed as it does not violate our policies."
            });

             const reporter = await this._userRepository.findById(report.reporterId);
             if (reporter) {
                 this._emailService.sendReportUpdateEmail(
                     reporter.email, 
                     `${reporter.firstName} ${reporter.lastName}`,
                     ReportStatus.DISMISSED,
                     dto.resolutionNotes || "This report was dismissed following administrative review."
                 );
             }
        }


        const fullReport = await this._reportRepository.findByIdWithDetails(dto.reportId);
        if (!fullReport) {
            throw new Error(REPORT_MESSAGES.REPORT_DETAILS_FAILED);
        }

        return fullReport;
    }
}
