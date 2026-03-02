import { UpdateWorkoutStatusRequestDTO } from "@/application/dto/workout/request/update-workoutStatus.dto";
import { UpdateWorkoutStatusResponseDTO } from "@/application/dto/workout/response/update-workoutStatus.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { WORKOUT_MESSAGES } from "@/domain/constants/messages.constants";
import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";



export class UpdateWorkoutStatusUseCase implements IBaseUseCase<UpdateWorkoutStatusRequestDTO,UpdateWorkoutStatusResponseDTO>{
    constructor(
        private readonly _workoutRepository:IWorkoutRepository
    ){}
    async execute(dto: UpdateWorkoutStatusRequestDTO): Promise<UpdateWorkoutStatusResponseDTO> {
        const workout = await this._workoutRepository.findById(dto.id);
        if(!workout){
            throw new Error(WORKOUT_MESSAGES.WORKOUT_NOT_FOUND);
        }
        workout.toggleStatus();
        await this._workoutRepository.updateStatus(
            dto.id,
            workout.status
        );
        return {
            message:WORKOUT_MESSAGES.WORKOUT_STATUS_UPDATED
        };
    }
}

