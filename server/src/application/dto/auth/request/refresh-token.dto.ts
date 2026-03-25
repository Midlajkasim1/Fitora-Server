// export interface RefreshTokenRequestDTO {
//   refreshToken: string;
// }
export class RefreshTokenRequestDTO {
  refreshToken!: string;

  constructor(data: RefreshTokenRequestDTO) {
    Object.assign(this, data);
  }
}