import { BlockGuard } from "@/presentation/middleware/block-guard.middleware";
import { authenticateUser } from "@/presentation/middleware/userAuth.middleware";
import { useCases } from "./user.usecases";

export const userMiddlewares = {
  authMiddleware: authenticateUser(),
  blockGuard:BlockGuard(useCases.checkUserBlockUseCase)
  
};