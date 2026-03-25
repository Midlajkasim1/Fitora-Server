// export interface VerifyResetOtpDTO {
//   email: string;
//   otp: string;
// }
export class VerifyResetOtpDTO {
  email!: string;
  otp!: string;

  constructor(data: VerifyResetOtpDTO) {
    Object.assign(this, data);
  }
}