import { authenticateAdmin } from "@/presentation/middleware/admin.auth.middleware";

export const adminMiddlewares = {
  authMiddleware: authenticateAdmin(),
};