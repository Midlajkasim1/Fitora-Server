import { AdminRole, UserRole } from "@/domain/constants/auth.constants";

declare global {
  namespace Express {
    interface Request {
    
      user?: {
        userId: string;
        email: string;
        role: UserRole | AdminRole;
      };
    }
  }
}