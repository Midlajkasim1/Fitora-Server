import { GetWorkoutSelectionRequestDTO } from "@/application/dto/user/request/get-workoutselection.dto";
import { GetWorkoutSelectionResponseDTO } from "@/application/dto/user/response/get-workoutSelection.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { WORKOUT_MESSAGES } from "@/domain/constants/messages.constants";
import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";


export class GetWorkoutSelectionUseCase implements IBaseUseCase<GetWorkoutSelectionRequestDTO,GetWorkoutSelectionResponseDTO>{
    constructor(
        private readonly _workoutRepository:IWorkoutRepository
    ){}
    async execute(dto: GetWorkoutSelectionRequestDTO): Promise<GetWorkoutSelectionResponseDTO> {
        const workout = await this._workoutRepository.findOneByWorkoutSelection(dto);
        if(!workout){
            throw new Error(WORKOUT_MESSAGES.WORKOUT_NOT_MATCH);
        }
        return {
            id:workout.id!,
            title:workout.title,
            videoUrl:workout.videoUrl,
            caloriesBurn:workout.caloriesBurn,
            description:workout.description
        };
    }
}