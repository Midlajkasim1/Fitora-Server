import { UserWeightProgressRequestDTO } from "@/application/dto/user/request/user-weight-progress.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";


export class UserWeightProgressUseCase implements IBaseUseCase<UserWeightProgressRequestDTO, void> {
    constructor(
        private readonly _healthMetricsRepository: IHealthMetricsRepository
    ) { }
    async execute(dto:UserWeightProgressRequestDTO): Promise<void> {
     await this._healthMetricsRepository.updateProgressWeight(dto.userId,dto.weight);

    }
}