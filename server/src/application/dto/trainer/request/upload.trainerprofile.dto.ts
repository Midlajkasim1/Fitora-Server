
export class UploadTrainerImageRequest {
  userId!: string;

  constructor(data: UploadTrainerImageRequest) {
    Object.assign(this, data);
  }
}