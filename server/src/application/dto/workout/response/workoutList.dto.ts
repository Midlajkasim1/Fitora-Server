import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";


export class WorkoutListItemDTO {
  id!: string;
  title!: string;
  duration!: number;
  difficulty!: WorkoutDifficulty;
  status!: WorkoutStatus;
  thumbnailUrl?: string;
  createdAt?: Date;

  constructor(data: WorkoutListItemDTO) {
    Object.assign(this, data);
  }
}