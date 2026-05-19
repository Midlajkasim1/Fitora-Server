

export class UpdateWorkoutStatusResponseDTO {
  message!: string;

  constructor(data: UpdateWorkoutStatusResponseDTO) {
    Object.assign(this, data);
  }
}