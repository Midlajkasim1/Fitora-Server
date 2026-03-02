import { WorkoutStatus } from "@/domain/constants/workout.constant";

export interface GetAllWorkoutRequestDTO {
    page:number;
    limit:number;
    search?:string;
    status?:WorkoutStatus;

};