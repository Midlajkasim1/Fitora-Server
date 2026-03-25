import { SpecializationStatus } from "@/domain/constants/auth.constants";

export class UpdateStatusResponseDTO {
  specializationId!: string;
  name!: string;
  status?: SpecializationStatus;
  message!: string;

  constructor(data: UpdateStatusResponseDTO) {
    Object.assign(this, data);
  }
}