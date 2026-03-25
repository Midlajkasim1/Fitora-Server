import { CheckHealthMetricsRequestDTO } from "@/application/dto/user/request/get-healthMetrics.dto";
import { SaveHealthMetricsRequestDTO } from "@/application/dto/user/request/user-health-metrics.dto";
import { CheckHealthMetricsResponseDTO } from "@/application/dto/user/response/get-healthMetrics.dto";
import { SaveHealthMetricsResponseDTO } from "@/application/dto/user/response/user-health-metrics.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { healthMetricsSchema } from "@/infrastructure/validators/user/onboarding/user-health-metrics.validators";
import { Request, Response } from "express";



export class HealthMetricsController {
    constructor(
        private readonly _saveHealthMetricsUseCase:IBaseUseCase<SaveHealthMetricsRequestDTO,SaveHealthMetricsResponseDTO>,
        private readonly _checkHealthMetricsUseCase: IBaseUseCase<CheckHealthMetricsRequestDTO,CheckHealthMetricsResponseDTO>
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
    async checkHealthMetrics(req:Request,res:Response):Promise<Response>{
        const userId = req.user?.userId;
        if(!userId){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const dto = new CheckHealthMetricsRequestDTO({userId});
        const result = await this._checkHealthMetricsUseCase.execute(dto);
      return  res.status(HttpStatus.OK).json({
            success:true,
            data:result
        });
    }

}