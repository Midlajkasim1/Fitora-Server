
export class UploadFileDTO {
  buffer!: Buffer;
  originalname!: string;
  mimetype!: string;
  size!: number;

  constructor(data: UploadFileDTO) {
    Object.assign(this, data);
  }
}