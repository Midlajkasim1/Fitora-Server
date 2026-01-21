import { AdminRepository } from "@/infrastructure/database/repositories/admin.repository";

export const adminRepositories = {
  adminRepository: new AdminRepository(),
};
