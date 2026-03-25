
// export interface VerifyOtpDTO{
//     email:string;
//     otp:string;
// }

export class VerifyOtpDTO {
  email!: string;
  otp!: string;

  constructor(data: VerifyOtpDTO) {
    Object.assign(this, data);
  }
}