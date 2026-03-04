import { WorkoutEntity } from "@/domain/entities/workout/workout.entity";
import { IBaseRepository } from "./base.repository";
import { WorkoutStatus } from "@/domain/constants/workout.constant";
import { GetWorkoutSelectionRequestDTO } from "@/application/dto/user/request/get-workoutSelection.dto";


export interface IWorkoutRepository extends IBaseRepository<WorkoutEntity> {
    create(workout: WorkoutEntity): Promise<WorkoutEntity>;
    findAll(params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
    }): Promise<{ workouts: WorkoutEntity[]; total: number }>;
    update(id: string, updateData:Record<string,unknown>):Promise<void | null>;
    findByTitle(title:string):Promise<WorkoutEntity | null>
    updateStatus(id:string,status:WorkoutStatus):Promise<void>;
    findBySpecializationId(specializationId:string):Promise<WorkoutEntity[] | null>;
    findOneByWorkoutSelection(dto:GetWorkoutSelectionRequestDTO):Promise<WorkoutEntity | null>;
}

