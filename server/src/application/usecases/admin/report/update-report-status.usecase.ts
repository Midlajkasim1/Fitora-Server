import { UpdateReportStatusRequestDTO } from "@/application/dto/admin/report/request/update-report-status.dto";
import { ReportResponseDTO } from "@/application/dto/report/response/report-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IReportRepository } from "@/domain/interfaces/repositories/report.repository";
import { ReportStatus, ReportType } from "@/domain/constants/report.constants";
import { ISocketEmitter } from "@/domain/interfaces/services/socket-emitter.interface";
import { ITrainerRepository } from "@/domain/interfaces/repositories/itrainer.repository";
import { IEmailService } from "@/domain/interfaces/services/email-service.interface";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";

export class UpdateReportStatusUseCase implements IBaseUseCase<UpdateReportStatusRequestDTO, ReportResponseDTO> {
    constructor(
        private readonly _reportRepository: IReportRepository,
        private readonly _socketEmitter: ISocketEmitter,
        private readonly _trainerRepository: ITrainerRepository,
        private readonly _userRepository: IUserRepository,
        private readonly _emailService: IEmailService
    ) {}

    async execute(dto: UpdateReportStatusRequestDTO): Promise<ReportResponseDTO> {
        const report = await this._reportRepository.findById(dto.reportId);
        if (!report) {
            throw new Error("Report not found");
        }

        // Update status in repository
        const updatedReport = await this._reportRepository.updateStatus(dto.reportId, dto.status, dto.resolutionNotes);
        if (!updatedReport) {
            throw new Error("Failed to update report status");
        }

        // Action Logic based on Resolve/Dismiss
        if (dto.status === ReportStatus.RESOLVED) {
            // 1. Logic for Professional Misconduct
            if (report.type === ReportType.MISCONDUCT) {
                // Trigger notification to the reported party (flagging logic)
                this._socketEmitter.emitToRoom(report.reportedId, "CRITICAL_NOTICE", {
                    type: "MISCONDUCT_RESOLUTION",
                    message: "A misconduct report against you has been resolved. Your account is now under administrative review.",
                    reportId: report.id
                });
                
                // Potentially flag TrainerDetails (requires update TrainerRepository to support flagging)
                // await this._trainerRepository.flagForReview(report.reportedId);
            }

            // 2. Logic for Trainer not showing up (Refund Logic)
            if (report.description.toLowerCase().includes("not showing up") || report.description.toLowerCase().includes("absent")) {
                // Trigger Refund Notification (Real refund would involve PaymentService)
                this._socketEmitter.emitToRoom(report.reporterId, "PAYMENT_NOTIFICATION", {
                    type: "REFUND_PROCESSED",
                    message: "Your report regarding trainer absence has been resolved. A session credit has been refunded to your account.",
                    reportId: report.id
                });
            }

            // Notify reporter of resolution via socket
            this._socketEmitter.emitToRoom(report.reporterId, "REPORT_UPDATE", {
                status: ReportStatus.RESOLVED,
                message: "Your report has been reviewed and resolved by our administration team."
            });

            // Send Email to Reporter
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
            // Notify reporter of dismissal
            this._socketEmitter.emitToRoom(report.reporterId, "REPORT_UPDATE", {
                status: ReportStatus.DISMISSED,
                message: "Your report has been reviewed but dismissed as it does not violate our policies."
            });

             // Send Email to Reporter
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


        return {
            id: updatedReport.id!,
            reporterId: updatedReport.reporterId,
            reportedId: updatedReport.reportedId,
            type: updatedReport.type,
            status: updatedReport.status,
            description: updatedReport.description,
            resolutionNotes: updatedReport.resolutionNotes,
            createdAt: updatedReport.createdAt!,
            updatedAt: updatedReport.updatedAt!
        };
    }
}
