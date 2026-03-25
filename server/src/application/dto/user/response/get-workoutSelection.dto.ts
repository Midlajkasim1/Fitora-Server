export class GetWorkoutSelectionResponseDTO {
  id!: string;
  title!: string;
  videoUrl!: string;
  duration!: number;
  caloriesBurn!: number;
  description!: string;

  constructor(data: GetWorkoutSelectionResponseDTO) {
    Object.assign(this, data);
  }
}