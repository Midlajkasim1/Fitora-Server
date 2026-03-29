import { TrainerDashboardResponseDTO } from "@/application/dto/trainer/response/trainer-dashboard.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { Request, Response } from "express";


export class TrainerController{
    constructor(
        private readonly _getTrainerDashboardUseCase:IBaseUseCase<string,TrainerDashboardResponseDTO>
    ){}
    async getTrainerDashboard(req:Request,res:Response):Promise<Response>{
        const trainerId = req.user?.userId;
        const dashboarddata = await this._getTrainerDashboardUseCase.execute(trainerId!);
        return res.status(HttpStatus.OK).json({
            success:true,
            data:dashboarddata
        });
    }
}