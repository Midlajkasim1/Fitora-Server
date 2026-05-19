// export interface ResetPasswordResponseDTO {
//   message: string;
//   success: boolean; 
// }
export class ResetPasswordResponseDTO {
  message!: string;
  success!: boolean;

  constructor(data: ResetPasswordResponseDTO) {
    Object.assign(this, data);
  }
}