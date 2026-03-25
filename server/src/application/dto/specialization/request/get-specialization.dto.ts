import { SpecializationStatus } from "@/domain/constants/auth.constants";


export class GetSpecializationRequest {
  page!: number;
  limit!: number;
  search?: string;
  status?: SpecializationStatus;

  constructor(data: GetSpecializationRequest) {
    Object.assign(this, data);
  }
}