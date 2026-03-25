// export interface ForgotPasswordRequestDTO {
//   email: string;
// }
export class ForgotPasswordRequestDTO {
  email!: string;

  constructor(data: ForgotPasswordRequestDTO) {
    Object.assign(this, data);
  }
}