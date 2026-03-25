export class AdminRefreshRequestDTO {
  refreshToken!: string;

  constructor(data: AdminRefreshRequestDTO) {
    Object.assign(this, data);
  }
}