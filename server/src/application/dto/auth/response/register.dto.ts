// export interface RegisterResponseDTO {
//   message: string;
// }
export class RegisterResponseDTO {
  message!: string;

  constructor(data: RegisterResponseDTO) {
    Object.assign(this, data);
  }
}