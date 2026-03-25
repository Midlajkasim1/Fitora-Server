import { ApprovalStatus } from "@/domain/constants/auth.constants";


export class GetTrainerVerificationRequestDTO {
  page!: number;
  limit!: number;
  search?: string;
  approvalStatus?: ApprovalStatus;

  constructor(data: GetTrainerVerificationRequestDTO) {
    Object.assign(this, data);
  }
}