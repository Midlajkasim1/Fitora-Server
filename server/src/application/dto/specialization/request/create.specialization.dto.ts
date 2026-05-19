import { SpecializationStatus } from "@/domain/constants/auth.constants";


export class CreateSpecializationDTO {
  name!: string;
  description?: string;
  imageUrl?: string;
  status?: SpecializationStatus;

  constructor(data: CreateSpecializationDTO) {
    Object.assign(this, data);
  }
}