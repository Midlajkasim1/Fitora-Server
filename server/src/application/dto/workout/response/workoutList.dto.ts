import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";


export interface WorkoutListItemDTO{
  id: string;
  title: string;
  duration: number;
  difficulty: WorkoutDifficulty;
  status: WorkoutStatus;
  thumbnailUrl?: string;
  createdAt?: Date;
}