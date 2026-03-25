import { WorkoutDifficulty } from "@/domain/constants/workout.constant";


export class CreateWorkoutRequestDTO {
  title!: string;
  description!: string;
  specializationId!: string;
  duration!: number;
  caloriesBurn!: number;
  bodyFocus!: string;
  difficulty!: WorkoutDifficulty;

  constructor(data: CreateWorkoutRequestDTO) {
    Object.assign(this, data);
  }
}