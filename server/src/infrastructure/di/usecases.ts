import { RegisterUseCase } from "@/application/usecases/auth/register.usecase";
import { repositories } from "./repositories";

export const useCases = {
  registerUseCase: new RegisterUseCase(repositories.userRepository),
};
