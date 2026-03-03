import { GetWorkoutBySpecializationRequestDTO } from "@/application/dto/user/request/get-workoutBy-Specialization.dto";
import { GetWorkoutsBySpecializationResponseDTO } from "@/application/dto/user/response/get-workoutBy-specialization.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { WORKOUT_MESSAGES } from "@/domain/constants/messages.constants";
import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";




export class GetWorkoutBySpecializationUseCase implements IBaseUseCase<GetWorkoutBySpecializationRequestDTO,GetWorkoutsBySpecializationResponseDTO>{
    constructor(
        private readonly _workoutRepository:IWorkoutRepository,
        
    ){}
async execute(dto: GetWorkoutBySpecializationRequestDTO): Promise<GetWorkoutsBySpecializationResponseDTO> {
    const workout = await this._workoutRepository.findBySpecializationId(dto.id);
    if(!workout){
        throw new Error(WORKOUT_MESSAGES.WORKOUT_NOT_FOUND);
    }
    return {
        workouts:workout.map(w=>({
        id:w.id!,
        title:w.title,
        description:w.description,
        duration:w.duration,
        caloriesBurn:w.caloriesBurn,
        bodyFocus:w.bodyFocus,
        difficulty:w.difficulty,
        thumbnailUrl:w.thumbnailUrl!,
        createdAt:w.createdAt
        
        })),
        total:workout.length
    };
}
    
}