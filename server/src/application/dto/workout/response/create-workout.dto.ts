import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";




export class CreateWorkoutResponseDTO {
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

  constructor(data: CreateWorkoutResponseDTO) {
    Object.assign(this, data);
  }
}