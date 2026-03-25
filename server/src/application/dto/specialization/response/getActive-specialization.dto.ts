import { SpecializationManagementDTO } from "./specialization-management.dto";


export class GetActiveSpecializationResponse {
  specialization!: SpecializationManagementDTO[];

  constructor(data: GetActiveSpecializationResponse) {
    Object.assign(this, data);
  }
}