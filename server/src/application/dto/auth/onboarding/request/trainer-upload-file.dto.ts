export interface UploadFileDTO {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}