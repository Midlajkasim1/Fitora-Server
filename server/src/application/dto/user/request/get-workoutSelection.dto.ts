export class GetWorkoutSelectionRequestDTO {
  id!: string;
  difficulty!: string;
  duration!: number;

  constructor(data: GetWorkoutSelectionRequestDTO) {
    Object.assign(this, data);
  }
}