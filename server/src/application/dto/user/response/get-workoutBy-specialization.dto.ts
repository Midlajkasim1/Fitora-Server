import { WorkoutBySpecializationListDTO } from "./get-workoutBySpList.dto";

export interface GetWorkoutsBySpecializationResponseDTO {
  workouts: WorkoutBySpecializationListDTO[];
  total: number;
}