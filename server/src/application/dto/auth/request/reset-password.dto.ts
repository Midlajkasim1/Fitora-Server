// export interface ResetPasswordDTO {
//   token: string; 
//   password: string;
// }
export class ResetPasswordDTO {
  token!: string;
  password!: string;

  constructor(data: ResetPasswordDTO) {
    Object.assign(this, data);
  }
}