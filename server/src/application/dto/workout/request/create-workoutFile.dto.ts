import { UploadFileDTO } from "../../auth/onboarding/request/trainer-upload-file.dto";


export class CreateWorkoutFiles {
  thumbnail!: UploadFileDTO;
  video!: UploadFileDTO;

  constructor(data: CreateWorkoutFiles) {
    Object.assign(this, data);
  }
}