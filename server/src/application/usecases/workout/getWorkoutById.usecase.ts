import { GetWorkoutByIdRequestDTO } from "@/application/dto/workout/request/get-workoutById.dto";
import { GetWorkoutByIdResponseDTO } from "@/application/dto/workout/response/get-workoutById.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { WORKOUT_MESSAGES } from "@/domain/constants/messages.constants";
import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";



export class GetWorkoutByIdUseCase implements IBaseUseCase<GetWorkoutByIdRequestDTO, GetWorkoutByIdResponseDTO> {
    constructor(
        private readonly _workoutRepository: IWorkoutRepository
    ) { }
    async execute(dto: GetWorkoutByIdRequestDTO): Promise<GetWorkoutByIdResponseDTO> {
        const workout = await this._workoutRepository.findById(dto.id);
        if (!workout) {
            throw new Error(WORKOUT_MESSAGES.WORKOUT_NOT_FOUND);
        }
        return {
            id: workout.id!,
            title: workout.title,
            description: workout.description,
            specializationId: workout.specializationId,
            duration: workout.duration,
            caloriesBurn: workout.caloriesBurn,
            bodyFocus: workout.bodyFocus,
            difficulty: workout.difficulty,
            videoUrl: workout.videoUrl,
            thumbnailUrl: workout.thumbnailUrl,
            status: workout.status,
            createdAt: workout.createdAt,
            updatedAt: workout.updatedAt,
        };
    }

}