import { SpecializationStatus } from "@/domain/constants/auth.constants";


export class SpecializationManagementDTO {
  id!: string;
  name!: string;
  description?: string;
  imageUrl?: string;
  status?: SpecializationStatus;

  constructor(data: SpecializationManagementDTO) {
    Object.assign(this, data);
  }
}