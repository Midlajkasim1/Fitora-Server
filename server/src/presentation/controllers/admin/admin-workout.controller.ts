import { CreateWorkoutRequestDTO } from "@/application/dto/workout/request/create-workout.dto";
import { CreateWorkoutFiles } from "@/application/dto/workout/request/create-workoutFile.dto";
import { GetAllWorkoutRequestDTO } from "@/application/dto/workout/request/get-all-workout.dto";
import { GetWorkoutByIdRequestDTO } from "@/application/dto/workout/request/get-workoutById.dto";
import { UpdateWorkoutRequestDTO } from "@/application/dto/workout/request/update-workout.dto";
import { UpdateWorkoutFiles } from "@/application/dto/workout/request/update-workoutFiles.dto";
import { UpdateWorkoutStatusRequestDTO } from "@/application/dto/workout/request/update-workoutStatus.dto";
import { CreateWorkoutResponseDTO } from "@/application/dto/workout/response/create-workout.dto";
import { GetAllWorkoutResponseDTO } from "@/application/dto/workout/response/get-all-workout.dto";
import { GetWorkoutByIdResponseDTO } from "@/application/dto/workout/response/get-workoutById.dto";
import { UpdatedWorkoutResponseDTO } from "@/application/dto/workout/response/update-workout.dto";
import { UpdateWorkoutStatusResponseDTO } from "@/application/dto/workout/response/update-workoutStatus.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { WORKOUT_MESSAGES } from "@/domain/constants/messages.constants";
import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";
import { UpdateWorkoutSchema } from "@/infrastructure/validators/admin/update-workout.validator";
import { CreateWorkoutSchema } from "@/infrastructure/validators/admin/workout.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";


export class WorkoutController {
   constructor(
      private readonly _createWorkoutUseCase: IBaseUseCase<CreateWorkoutRequestDTO, CreateWorkoutResponseDTO, CreateWorkoutFiles>,
      private readonly _getAllWorkoutUsecase: IBaseUseCase<GetAllWorkoutRequestDTO, GetAllWorkoutResponseDTO>,
      private readonly _getWorkoutByIdUseCase: IBaseUseCase<GetWorkoutByIdRequestDTO, GetWorkoutByIdResponseDTO>,
      private readonly _updateWorkoutUseCase: IBaseUseCase<UpdateWorkoutRequestDTO, UpdatedWorkoutResponseDTO, UpdateWorkoutFiles>,
      private readonly _updateWorkoutStatusUseCase: IBaseUseCase<UpdateWorkoutStatusRequestDTO, UpdateWorkoutStatusResponseDTO>
   ) { }
   async createWorkout(req: Request, res: Response): Promise<Response> {
      const dto = CreateWorkoutSchema.parse(req.body);
      const files = req.files as {
         video?: Express.Multer.File[];
         thumbnail?: Express.Multer.File[];
      };
      if (!files?.video?.[0] || !files?.thumbnail?.[0]) {
         return res
            .status(HttpStatus.BAD_REQUEST)
            .json(ApiResponse.error(WORKOUT_MESSAGES.FILES_MUST_REQUIRED));
      }
      const result = await this._createWorkoutUseCase.execute(dto, {
         video: files.video[0],
         thumbnail: files.thumbnail[0]
      });
      return res.status(HttpStatus.OK).json(ApiResponse.success(result, WORKOUT_MESSAGES.WORKOUT_CREATED));

   }
   async getAllWorkout(req: Request, res: Response): Promise<Response> {
      const dto: GetAllWorkoutRequestDTO = {
         page: Number(req.query.page) || 1,
         limit: Number(req.query.limit) || 10,
         search: req.query.search as string,
         status: req.query.status as WorkoutStatus.ACTIVE | WorkoutStatus.BLOCKED | undefined,
         difficulty: req.query.difficulty as WorkoutDifficulty.BEGINNER | WorkoutDifficulty.ADVANCED | WorkoutDifficulty.INTERMEDIATE,

      };
      const result = await this._getAllWorkoutUsecase.execute(dto);
      return res.status(HttpStatus.OK).json(ApiResponse.success(result));

   }
   async getWorkoutById(req: Request, res: Response): Promise<Response> {
      const id = req.params.id;
      const result = await this._getWorkoutByIdUseCase.execute({ id });
      return res.status(HttpStatus.OK).json(ApiResponse.success(result));
   }
   async updateWorkout(req: Request, res: Response): Promise<Response> {
      const dto = UpdateWorkoutSchema.parse({
         id: req.params.id,
         ...req.body
      });
      const files = req.files as {
         video?: Express.Multer.File[];
         thumbnail?: Express.Multer.File[];
      };
      const result = await this._updateWorkoutUseCase.execute(dto, {
         video: files?.video?.[0],
         thumbnail: files?.thumbnail?.[0]
      });
      return res.status(HttpStatus.OK).json(ApiResponse.success(result,WORKOUT_MESSAGES.WORKOUT_UPDATED));
   }
   async updateWorkoutStatus(req: Request, res: Response): Promise<Response> {
      const dto = { id: req.params.id };
   const result  =  await this._updateWorkoutStatusUseCase.execute(dto);
      return res.status(HttpStatus.OK).json(ApiResponse.success(result,WORKOUT_MESSAGES.WORKOUT_STATUS_UPDATED));
   }
}
