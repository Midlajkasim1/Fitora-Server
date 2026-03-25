import { UserManagementDTO } from "./user-management.dto";


export class GetUsersResponseDTO {
  users!: UserManagementDTO[];
  total!: number;

  constructor(data: GetUsersResponseDTO) {
    Object.assign(this, data);
  }
}