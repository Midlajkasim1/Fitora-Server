import { CreateReportRequestDTO } from "@/application/dto/report/request/create-report.dto";
import { CreateReportResponseDTO } from "@/application/dto/report/response/create-report-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IReportRepository } from "@/domain/interfaces/repositories/report.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ReportEntity } from "@/domain/entities/report/report.entity";
import { ReportStatus } from "@/domain/constants/report.constants";
import { REPORT_MESSAGES } from "@/domain/constants/messages.constants";

export class CreateReportUseCase implements IBaseUseCase<CreateReportRequestDTO, CreateReportResponseDTO> {
    constructor(
        private readonly _reportRepository: IReportRepository,
        private readonly _slotRepository: ISlotRepository
    ) {}

    async execute(dto: CreateReportRequestDTO): Promise<CreateReportResponseDTO> {
     
        const gracePeriod = new Date();
        gracePeriod.setDate(gracePeriod.getDate() - 30);

        const hasConnection = await this._slotRepository.hasActiveOrRecentBooking(
            dto.reporterId, 
            dto.reportedId, 
            gracePeriod
        );

        if (!hasConnection && dto.type !== "Bug") {
     
             throw new Error(REPORT_MESSAGES.REPORT_CONNECTION_REQUIRED);
        }

        if (dto.sessionId) {
            const existingReport = await this._reportRepository.findBySessionAndReporter(dto.sessionId, dto.reporterId);
            if (existingReport) {
                throw new Error(REPORT_MESSAGES.REPORT_SESSION_ALREADY);
            }
        }

        const report = new ReportEntity({
            reporterId: dto.reporterId,
            reportedId: dto.reportedId,
            type: dto.type,
            status: ReportStatus.PENDING,
            description: dto.description,
            sessionId: dto.sessionId
        });

        const savedReport = await this._reportRepository.create(report);

        return {
            id: savedReport.id!,
            reporterId: savedReport.reporterId,
            reportedId: savedReport.reportedId,
            type: savedReport.type,
            status: savedReport.status,
            description: savedReport.description,
            createdAt: savedReport.createdAt!,
            updatedAt: savedReport.updatedAt!
        };
    }
}
