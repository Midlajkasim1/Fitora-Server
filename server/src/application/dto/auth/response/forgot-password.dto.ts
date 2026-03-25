
export class ForgotPasswordResponseDTO {
  message!: string;

  constructor(data: ForgotPasswordResponseDTO) {
    Object.assign(this, data);
  }
}