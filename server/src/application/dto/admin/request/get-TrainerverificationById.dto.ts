
export class GetTrainerVerificationByIdRequestDTO {
  id!: string;

  constructor(data: GetTrainerVerificationByIdRequestDTO) {
    Object.assign(this, data);
  }
}