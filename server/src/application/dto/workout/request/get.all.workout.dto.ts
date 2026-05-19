import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";

export class GetAllWorkoutRequestDTO {
  page!: number;
  limit!: number;
  search?: string;
  status?: WorkoutStatus;
  difficulty?: WorkoutDifficulty;
  duration?: number;

  constructor(data: GetAllWorkoutRequestDTO) {
    Object.assign(this, data);
  }
}