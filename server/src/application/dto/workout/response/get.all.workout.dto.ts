import { WorkoutListItemDTO } from "./workout.list.dto";


export class GetAllWorkoutResponseDTO {
  workouts!: WorkoutListItemDTO[];
  total!: number;

  constructor(data: GetAllWorkoutResponseDTO) {
    Object.assign(this, data);
  }
}