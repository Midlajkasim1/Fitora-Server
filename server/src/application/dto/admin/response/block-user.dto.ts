import { UserStatus } from "@/domain/constants/auth.constants";

export class BlockUserResponseDTO {
  id!: string;
  email!: string;
  status!: UserStatus;
  message!: string;

  constructor(data: BlockUserResponseDTO) {
    Object.assign(this, data);
  }
}