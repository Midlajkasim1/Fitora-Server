
export class GetWorkoutBySpecializationRequestDTO {
  id!: string;

  constructor(data: GetWorkoutBySpecializationRequestDTO) {
    Object.assign(this, data);
  }
}