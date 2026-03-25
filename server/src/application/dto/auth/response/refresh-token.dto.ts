// export interface RefreshTokenResponseDTO {
//   accessToken: string;
// }

export class RefreshTokenResponseDTO {
  accessToken!: string;

  constructor(data: RefreshTokenResponseDTO) {
    Object.assign(this, data);
  }
}