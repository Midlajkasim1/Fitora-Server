import { CreateReportRequestDTO } from "@/application/dto/report/request/create-report.dto";
import { ReportResponseDTO } from "@/application/dto/report/response/report-response.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IReportRepository } from "@/domain/interfaces/repositories/report.repository";
import { ISlotRepository } from "@/domain/interfaces/repositories/slot.repository";
import { ReportEntity } from "@/domain/entities/report/report.entity";
import { ReportStatus } from "@/domain/constants/report.constants";

export class CreateReportUseCase implements IBaseUseCase<CreateReportRequestDTO, ReportResponseDTO> {
    constructor(
        private readonly _reportRepository: IReportRepository,
        private readonly _slotRepository: ISlotRepository
    ) {}

    async execute(dto: CreateReportRequestDTO): Promise<ReportResponseDTO> {
        // Validation: Reporter must have been involved in a session with Reported party
        // We check last 30 days of sessions to verify relationship
        const gracePeriod = new Date();
        gracePeriod.setDate(gracePeriod.getDate() - 30);

        const hasConnection = await this._slotRepository.hasActiveOrRecentBooking(
            dto.reporterId, 
            dto.reportedId, 
            gracePeriod
        );

        if (!hasConnection && dto.type !== "Bug") {
             // For misconduct/harassment, they MUST have a session connection.
             // For bugs, we might skip this.
             throw new Error("You can only report individuals you have had a session with in the last 30 days.");
        }

        const report = new ReportEntity({
            reporterId: dto.reporterId,
            reportedId: dto.reportedId,
            type: dto.type,
            status: ReportStatus.PENDING,
            description: dto.description
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
