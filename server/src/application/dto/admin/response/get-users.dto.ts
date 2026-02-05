import { UserManagementDTO } from "./user-management.dto";

export interface GetUsersResponseDTO {
  users: UserManagementDTO[]; 
  total: number;
}