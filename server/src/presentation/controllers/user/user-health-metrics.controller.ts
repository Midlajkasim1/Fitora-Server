import { SaveHealthMetricsRequestDTO } from "@/application/dto/user/request/user-health-metrics.dto";
import { SaveHealthMetricsResponseDTO } from "@/application/dto/user/response/user-health-metrics.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { healthMetricsSchema } from "@/infrastructure/validators/user/onboarding/user-health-metrics.validators";
import { Request, Response } from "express";



export class HealthMetricsController {
    constructor(
        private readonly _saveHealthMetricsUseCase:IBaseUseCase<SaveHealthMetricsRequestDTO,SaveHealthMetricsResponseDTO>
    ){}
    async saveMetrics(req:Request,res:Response):Promise<Response>{
     const validData = healthMetricsSchema.parse({
        ...req.body,
        userId:req.user?.userId
     });
     const result = await this._saveHealthMetricsUseCase.execute(validData);
     return res.status(HttpStatus.OK).json({
        success:true,
        data:result 
     });      
    }
}