import { authenticateUser } from "@/presentation/middleware/userAuth.middleware";
import { userRepositories } from "./user.repositories";

export const userMiddlewares = {
  authMiddleware: authenticateUser(userRepositories.userRepository),
  
};