import { WorkoutEntity } from "@/domain/entities/workout/workout.entity";
import { IBaseRepository } from "./base.repository";
import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";
import { GetWorkoutSelectionRequestDTO } from "@/application/dto/user/request/get-workoutSelection.dto";


export interface IWorkoutRepository extends IBaseRepository<WorkoutEntity> {
    findAllWorkout(params: {
        page: number;
        limit: number;
        search?: string;
        status?: WorkoutStatus;
        difficulty?:WorkoutDifficulty;
        duration?:number;
    }): Promise<{ data: WorkoutEntity[]; total: number }>;
    findByTitle(title:string):Promise<WorkoutEntity | null>
    updateStatus(id:string,status:WorkoutStatus):Promise<void>;
    findBySpecializationId(specializationId:string):Promise<WorkoutEntity[] | null>;
    findOneByWorkoutSelection(dto:GetWorkoutSelectionRequestDTO):Promise<WorkoutEntity | null>;
}

