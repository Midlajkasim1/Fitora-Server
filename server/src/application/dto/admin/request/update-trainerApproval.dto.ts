import { ApprovalStatus } from "@/domain/constants/auth.constants";

export class UpdateTrainerApprovalRequestDTO {
  trainerDetailId!: string;
  status!: ApprovalStatus;
  reason?: string;

  constructor(data: UpdateTrainerApprovalRequestDTO) {
    Object.assign(this, data);
  }
}