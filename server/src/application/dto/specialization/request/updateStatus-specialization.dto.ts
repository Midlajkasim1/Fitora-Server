export class UpdateStatusRequestDTO {
  specializationId!: string;

  constructor(data: UpdateStatusRequestDTO) {
    Object.assign(this, data);
  }
}