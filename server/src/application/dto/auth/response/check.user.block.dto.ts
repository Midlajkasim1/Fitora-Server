import { UserStatus } from "@/domain/constants/auth.constants";

export class    CheckUserBlockResponseDTO {
  userId!: string;
  status!:UserStatus;
  isBlocked!:boolean;


  constructor(data: CheckUserBlockResponseDTO) {
    Object.assign(this, data);
  }
}