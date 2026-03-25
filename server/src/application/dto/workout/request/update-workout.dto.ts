import { WorkoutDifficulty } from "@/domain/constants/workout.constant";

export class UpdateWorkoutRequestDTO {
  id!: string;
  title?: string;
  description?: string;
  specializationId?: string;
  duration?: number;
  caloriesBurn?: number;
  bodyFocus?: string;
  difficulty?: WorkoutDifficulty;

  constructor(data: UpdateWorkoutRequestDTO) {
    Object.assign(this, data);
  }
}