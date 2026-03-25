import { WorkoutBySpecializationListDTO } from "./get-workoutBySpList.dto";

export class GetWorkoutsBySpecializationResponseDTO {
  workouts!: WorkoutBySpecializationListDTO[];
  total!: number;

  constructor(data: GetWorkoutsBySpecializationResponseDTO) {
    Object.assign(this, data);
  }
}