"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLoginUseCase = void 0;
class AdminLoginUseCase {
    adminRepository;
    passwordHasher;
    tokenService;
    constructor(adminRepository, passwordHasher, tokenService) {
        this.adminRepository = adminRepository;
        this.passwordHasher = passwordHasher;
        this.tokenService = tokenService;
    }
    async execute(dto) {
        const result = await this.adminRepository.findByEmail(dto.email);
        if (!result)
            throw new Error("Invalid credentials");
        const { admin, passwordHash } = result;
        if (!admin.isActive()) {
            throw new Error("Admin blocked");
        }
        const isMatch = await this.passwordHasher.compare(dto.password, passwordHash);
        if (!isMatch)
            throw new Error("Invalid credentials");
        return {
            accessToken: this.tokenService.generateAccessToken({
                userId: admin.id,
                email: admin.email,
                role: "admin",
            }),
            message: "Admin login successful",
        };
    }
}
exports.AdminLoginUseCase = AdminLoginUseCase;
