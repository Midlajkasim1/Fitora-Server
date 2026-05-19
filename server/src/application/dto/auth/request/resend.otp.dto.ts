// export interface ResendOtpDTO {
//     email:string
// }
export class ResendOtpDTO {
  email!: string;

  constructor(data: ResendOtpDTO) {
    Object.assign(this, data);
  }
}