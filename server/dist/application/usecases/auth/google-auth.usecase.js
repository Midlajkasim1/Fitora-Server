"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAuthUseCase = void 0;
const user_entity_1 = require("@/domain/entities/user.entity");
class GoogleAuthUseCase {
    userRepository;
    tokenService;
    googleTokenProvider;
    constructor(userRepository, tokenService, googleTokenProvider) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
        this.googleTokenProvider = googleTokenProvider;
    }
    async execute(idToken, role) {
        const googleUser = await this.googleTokenProvider.verifyIdToken(idToken);
        let user = await this.userRepository.findEntityByEmail(googleUser.email);
        if (!user) {
            const newUser = user_entity_1.UserEntity.create({
                email: googleUser.email,
                firstName: googleUser.firstName,
                lastName: googleUser.lastName,
                phone: "",
                role: role,
                isEmailVerified: true,
            });
            user = await this.userRepository.create(newUser, "", {
                authProvider: "google",
                googleId: googleUser.googleId,
            });
        }
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
            message: "Google authentication successful",
        };
    }
}
exports.GoogleAuthUseCase = GoogleAuthUseCase;
