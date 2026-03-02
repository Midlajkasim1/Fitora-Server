import { WorkoutListItemDTO } from "./workoutList.dto";


export interface GetAllWorkoutResponseDTO{
    workouts:WorkoutListItemDTO[];
    total:number;
}