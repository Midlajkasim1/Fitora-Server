import { ApprovalStatus } from "@/domain/constants/auth.constants";


export class TrainerVerificationListDTO {
  id!: string;
  userId!: string;
  trainerName!: string;
  email!: string;
  experienceYear!: number;
  approvalStatus!: ApprovalStatus;
  createdAt!: Date;

  constructor(data: TrainerVerificationListDTO) {
    Object.assign(this, data);
  }
}