// export interface VerifyResetOtpResponseDTO {
//   resetToken: string; 
// }
export class VerifyResetOtpResponseDTO {
  resetToken!: string;

  constructor(data: VerifyResetOtpResponseDTO) {
    Object.assign(this, data);
  }
}