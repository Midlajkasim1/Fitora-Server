import { authenticateAdmin } from "@/presentation/middleware/adminAuth.middleware";

export const adminMiddlewares = {
  authMiddleware: authenticateAdmin(),
};