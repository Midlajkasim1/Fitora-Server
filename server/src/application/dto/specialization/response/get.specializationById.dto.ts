import { SpecializationStatus } from "@/domain/constants/auth.constants";

export class GetSpecializationByIdResponseDTO {
  id!: string;
  name!: string;
  description?: string;
  imageUrl?: string;
  status!: SpecializationStatus;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(data: GetSpecializationByIdResponseDTO) {
    Object.assign(this, data);
  }
}