
export class UploadImageRequest {
  userId!: string;

  constructor(data: UploadImageRequest) {
    Object.assign(this, data);
  }
}