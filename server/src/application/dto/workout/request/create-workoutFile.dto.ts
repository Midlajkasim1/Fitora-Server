import { UploadFileDTO } from "../../auth/onboarding/request/trainer-upload-file.dto";


export interface CreateWorkoutFiles {
  video: UploadFileDTO;
  thumbnail: UploadFileDTO;
}