import { GetAllWorkoutRequestDTO } from "@/application/dto/workout/request/get-all-workout.dto";
import { GetAllWorkoutResponseDTO } from "@/application/dto/workout/response/get-all-workout.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";



export class GetAllWorkoutUseCase implements IBaseUseCase<GetAllWorkoutRequestDTO,GetAllWorkoutResponseDTO>{
    constructor(
        private readonly _workoutRepository:IWorkoutRepository
    ){}
    async execute(dto: GetAllWorkoutRequestDTO): Promise<GetAllWorkoutResponseDTO> {
      const {workouts, total} = await this._workoutRepository.findAll(dto);  
      return {
        workouts:workouts.map(w=>({
         id:w.id!,
         title:w.title,
         duration:w.duration,
         difficulty:w.difficulty,
         status:w.status,
         thumbnailUrl:w.thumbnailUrl,
         createdAt:w.createdAt
        })),
        total
      };
    }
}