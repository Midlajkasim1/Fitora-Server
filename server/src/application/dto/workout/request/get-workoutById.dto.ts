

export class GetWorkoutByIdRequestDTO {
  id!: string;

  constructor(data: GetWorkoutByIdRequestDTO) {
    Object.assign(this, data);
  }
}