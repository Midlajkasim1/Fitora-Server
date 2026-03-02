import { SpecializationStatus } from "@/domain/constants/auth.constants";

export interface GetSpecializationByIdResponseDTO {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  status: SpecializationStatus;
  createdAt: Date;
  updatedAt: Date;
}