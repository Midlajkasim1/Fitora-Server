
export class UpdatedWorkoutResponseDTO {
  message!: string;

  constructor(data: UpdatedWorkoutResponseDTO) {
    Object.assign(this, data);
  }
}