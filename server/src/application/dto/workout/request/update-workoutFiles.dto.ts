import { UploadFileDTO } from "../../auth/onboarding/request/trainer-upload-file.dto";

export class UpdateWorkoutFiles {
  thumbnail?: UploadFileDTO;
  video?: UploadFileDTO;

  constructor(data: UpdateWorkoutFiles) {
    Object.assign(this, data);
  }
}