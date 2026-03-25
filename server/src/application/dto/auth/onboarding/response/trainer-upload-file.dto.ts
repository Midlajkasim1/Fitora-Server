// export interface UploadFileResponseDTO {
//   url: string;      
//   fileName: string; 
//   mimeType: string;
// }
export class UploadFileResponseDTO {
  url!: string;
  fileName!: string;
  mimeType!: string;

  constructor(data: UploadFileResponseDTO) {
    Object.assign(this, data);
  }
}