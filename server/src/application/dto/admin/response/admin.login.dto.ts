export class AdminLoginResponseDTO {
  accessToken!: string;
  refreshToken!: string;

  constructor(data: AdminLoginResponseDTO) {
    Object.assign(this, data);
  }
}