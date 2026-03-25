// export interface ResendOtpResponseDTO {
//   message: string;
// }
export class ResendOtpResponseDTO {
  message!: string;

  constructor(data: ResendOtpResponseDTO) {
    Object.assign(this, data);
  }
}