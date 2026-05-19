import { SpecializationStatus } from "@/domain/constants/auth.constants";

export class UpdateSpecializationDTO {
  id!: string;
  name!: string;
  description?: string;
  status?: SpecializationStatus;

  constructor(data: UpdateSpecializationDTO) {
    Object.assign(this, data);
  }
}