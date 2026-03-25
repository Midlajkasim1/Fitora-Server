import { ApprovalStatus } from "@/domain/constants/auth.constants";

export class GetTrainerVerificationByIdResponseDTO {
  id!: string;
  userId!: string;
  trainerName!: string;
  email!: string;
  experienceYear!: number;
  approvalStatus!: ApprovalStatus;
  createdAt!: Date;
  bio!: string;
  certifications!: string[];
  specializations!: {
    id: string;
    name: string;
  }[];
  rejectionReason?: string | null;

  constructor(data: GetTrainerVerificationByIdResponseDTO) {
    Object.assign(this, data);
  }
}