import { GenerateDietRequestDTO } from "@/application/dto/ai-workout&diet/request/generate-diet-plan.dto";
import { GenerateWorkoutRequestDTO } from "@/application/dto/ai-workout&diet/request/generate-plan.request.dto";
import { GetDietPlanRequestDTO } from "@/application/dto/ai-workout&diet/request/get-diet-plan.dto";
import { GetWorkoutPlanRequestDTO } from "@/application/dto/ai-workout&diet/request/get-workoutPlan.dto";
import { GenerateDietResponseDTO } from "@/application/dto/ai-workout&diet/response/generate-diet-plan.dto";
import { GenerateWorkoutResponseDTO } from "@/application/dto/ai-workout&diet/response/generate-plan.dto";
import { GetDietPlanResponseDTO } from "@/application/dto/ai-workout&diet/response/get-diet-plan.dto";
import { GetWorkoutPlanResponseDTO } from "@/application/dto/ai-workout&diet/response/get-workout-plan.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { Request, Response } from "express";

export class AiPlanController {
    constructor(
        private readonly _generateWorkoutPlanUseCase: IBaseUseCase<GenerateWorkoutRequestDTO, GenerateWorkoutResponseDTO>,
        private readonly _generateDietPlanUseCase: IBaseUseCase<GenerateDietRequestDTO, GenerateDietResponseDTO>,
        private readonly _getWorkoutPlanUseCase: IBaseUseCase<GetWorkoutPlanRequestDTO, GetWorkoutPlanResponseDTO>,
        private readonly _getDietPlanUseCase: IBaseUseCase<GetDietPlanRequestDTO, GetDietPlanResponseDTO>
    ) { }
    async getWorkoutPlan(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.UNAUTHORIZED
            });
        }
        const dto = new GetWorkoutPlanRequestDTO({
            userId: userId
        });
        const result = await this._getWorkoutPlanUseCase.execute(dto);
        return res.status(200).json(result);
    }
    async getDietPlan(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId){
        return res.status(HttpStatus.UNAUTHORIZED).json({ success: false, message: AUTH_MESSAGES.UNAUTHORIZED });

        } 

        const dto = new GetDietPlanRequestDTO({ userId });
        const result = await this._getDietPlanUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(result);
    }
    async generateWorkout(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        const metrics = req.body.metrics;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.UNAUTHORIZED
            });
        }
        const dto = new GenerateWorkoutRequestDTO({ userId, metrics });
        const result = await this._generateWorkoutPlanUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(result);
    }
    async generateDiet(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        const metrics = req.body.metrics;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.UNAUTHORIZED
            });
        }
        const dto = new GenerateDietRequestDTO({
            userId,
            metrics: metrics
        });
        const result = await this._generateDietPlanUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(result);
    }


}
