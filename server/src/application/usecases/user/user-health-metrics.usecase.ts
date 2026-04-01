import { SaveHealthMetricsRequestDTO } from "@/application/dto/user/request/user-health-metrics.dto";
import { SaveHealthMetricsResponseDTO } from "@/application/dto/user/response/user-health-metrics.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HEALTH_METRICS_MESSAGES } from "@/domain/constants/messages.constants";
import { HealthMetricsEntity } from "@/domain/entities/user/client-health-metrics.entity";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";


export class SaveHealthMetricsUseCase implements IBaseUseCase<SaveHealthMetricsRequestDTO,SaveHealthMetricsResponseDTO>{
    constructor(
        private readonly _healthMetricsRepository:IHealthMetricsRepository
    ){}
    async execute(dto: SaveHealthMetricsRequestDTO): Promise<SaveHealthMetricsResponseDTO> {
        const healthmetrics = HealthMetricsEntity.create({
            userId:dto.userId,
            height:dto.height,
            weight:dto.weight,
            targetWeight:dto.targetWeight,
            primaryGoal:dto.primaryGoal,
            updateAt:new Date()
        });
        await this._healthMetricsRepository.save(healthmetrics);
        return new SaveHealthMetricsResponseDTO({
            message:HEALTH_METRICS_MESSAGES.HEALTH_METRICS_SAVED
        });
    }
}