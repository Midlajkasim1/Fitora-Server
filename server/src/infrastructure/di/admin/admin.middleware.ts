import { authenticateAdmin } from "@/presentation/middleware/adminAuth.middleware";
import { adminRepositories } from "./admin.repositories";

export const adminMiddlewares = {
  authMiddleware: authenticateAdmin(adminRepositories.adminRepository),
};