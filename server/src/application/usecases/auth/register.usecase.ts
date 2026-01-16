import { RegisterDTO } from "@/application/dto/auth/register.dto";
import { IUserRepository } from "@/domain/interfaces/repositories/user.repository";
import { UserEntity } from "@/domain/entities/user.entity";
import { PasswordHasher } from "@/shared/utils/password-hash";
export class RegisterUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: RegisterDTO) {
    const {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      role,
    } = dto;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await PasswordHasher.hash(password);

    const userEntity = UserEntity.create({
      email,
      firstName,
      lastName,
      phone,
      role,
    });

    const createdUser = await this.userRepository.create(
      userEntity,
      hashedPassword,
      { authProvider: "local" }
    );

    return {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
    };
  }
}
