import { UserStatus } from "@/domain/constants/auth.constants";

export class BlockTrainerResponseDTO {
  id!: string;
  email!: string;
  status!: UserStatus;
  message!: string;

  constructor(data: BlockTrainerResponseDTO) {
    Object.assign(this, data);
  }
}