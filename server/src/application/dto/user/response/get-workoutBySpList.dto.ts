export class WorkoutBySpecializationListDTO {
  id!: string;
  title!: string;
  description!: string;
  duration!: number;
  caloriesBurn!: number;
  bodyFocus!: string;
  difficulty!: string;
  thumbnailUrl!: string;
  createdAt?: Date;

  constructor(data: WorkoutBySpecializationListDTO) {
    Object.assign(this, data);
  }
}


