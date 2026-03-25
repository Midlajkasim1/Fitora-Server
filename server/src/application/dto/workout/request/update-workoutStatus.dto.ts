
export class UpdateWorkoutStatusRequestDTO {
  id!: string;

  constructor(data: UpdateWorkoutStatusRequestDTO) {
    Object.assign(this, data);
  }
}