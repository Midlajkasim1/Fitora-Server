import { UploadFileDTO } from "../../auth/onboarding/request/trainer-upload-file.dto";

export interface UpdateWorkoutFiles {
  video?: UploadFileDTO;
  thumbnail?: UploadFileDTO;
}