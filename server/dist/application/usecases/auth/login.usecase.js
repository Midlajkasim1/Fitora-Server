"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginUseCase = void 0;
class LoginUseCase {
    userRepository;
    passwordService;
    tokenService;
    constructor(userRepository, passwordService, tokenService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
        this.tokenService = tokenService;
    }
    async execute(dto) {
        const result = await this.userRepository.findByEmail(dto.email);
        if (!result)
            throw new Error("Invalid credentials");
        const { user, passwordHash } = result;
        if (!user.isverfied())
            throw new Error("Account not verified");
        if (!user.isActive())
            throw new Error("Account blocked");
        const isMatch = await this.passwordService.compare(dto.password, passwordHash);
        if (!isMatch)
            throw new Error("Invalid credentials");
        return {
            accessToken: this.tokenService.generateAccessToken({
                userId: user.id,
                email: user.email,
                role: user.role,
            }),
            refreshToken: this.tokenService.generateRefreshToken({
                userId: user.id,
            }),
            role: user.role,
            isOnboardingRequired: !user.phone || user.phone === "",
            message: "Login successful",
        };
    }
}
exports.LoginUseCase = LoginUseCase;
