import { SpecializationManagementDTO } from "./specialization-management.dto";


export class GetSpecializationResponseDTO {
  specialization!: SpecializationManagementDTO[];
  total!: number;

  constructor(data: GetSpecializationResponseDTO) {
    Object.assign(this, data);
  }
}