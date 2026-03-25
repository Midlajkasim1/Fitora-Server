
export class AdminRefreshResponseDTO {
  accessToken!: string;

  constructor(data: AdminRefreshResponseDTO) {
    Object.assign(this, data);
  }
}