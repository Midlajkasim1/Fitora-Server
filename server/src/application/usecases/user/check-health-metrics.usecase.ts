import { CheckHealthMetricsRequestDTO } from "@/application/dto/user/request/get-healthMetrics.dto";
import { CheckHealthMetricsResponseDTO } from "@/application/dto/user/response/get-healthMetrics.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IHealthMetricsRepository } from "@/domain/interfaces/repositories/onboarding/iclient-health-metrics.interface";



export class CheckHealthMetricsUseCase implements IBaseUseCase<CheckHealthMetricsRequestDTO,CheckHealthMetricsResponseDTO>{
    constructor(
        private readonly _healthMetricsRepostory:IHealthMetricsRepository
    ){}
    async execute(dto: CheckHealthMetricsRequestDTO): Promise<CheckHealthMetricsResponseDTO> {
     const metrics = await this._healthMetricsRepostory.findByUserId(dto.userId);
     if(!metrics){
        return new CheckHealthMetricsResponseDTO({exists:false}); 
     }   
     return new CheckHealthMetricsResponseDTO({
        exists:true,
        metrics:{
            height:metrics.height,
            weight:metrics.weight,
            targetWeight:metrics.targetWeight,
            primaryGoal:metrics.primaryGoal
        }
     });
    }
}