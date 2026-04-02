
export class UploadTrainerImageResponse {
  profileImage!: string;
  message!: string;

  constructor(data: UploadTrainerImageResponse) {
    Object.assign(this, data);
  }
}