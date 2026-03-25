import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";

export class GetWorkoutByIdResponseDTO {
  id!: string;
  title!: string;
  description!: string;
  specializationId!: string;
  duration!: number;
  caloriesBurn!: number;
  bodyFocus!: string;
  difficulty!: WorkoutDifficulty;
  videoUrl!: string;
  thumbnailUrl?: string;
  status!: WorkoutStatus;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: GetWorkoutByIdResponseDTO) {
    Object.assign(this, data);
  }
}