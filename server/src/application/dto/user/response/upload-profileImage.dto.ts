
export class UploadImageResponse {
  profileImage!: string;
  message!: string;

  constructor(data: UploadImageResponse) {
    Object.assign(this, data);
  }
}