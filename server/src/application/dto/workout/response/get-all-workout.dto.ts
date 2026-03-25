import { WorkoutListItemDTO } from "./workoutList.dto";


export class GetAllWorkoutResponseDTO {
  workouts!: WorkoutListItemDTO[];
  total!: number;

  constructor(data: GetAllWorkoutResponseDTO) {
    Object.assign(this, data);
  }
}