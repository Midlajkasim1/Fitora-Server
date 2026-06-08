import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer.upload.file.dto";
import { ChangePasswordRequest } from "@/application/dto/user/request/change.password.dto";
import { UpdateUserProfileRequest } from "@/application/dto/user/request/update.userprofile.dto";
import { UploadImageRequest } from "@/application/dto/user/request/upload.profileImage.dto";
import { ChangePasswordResponse } from "@/application/dto/user/response/change.password.dto";
import { UserDashboardResponseDTO } from "@/application/dto/user/response/dashboard.dto";
import { GetUserProfileResponse } from "@/application/dto/user/response/get.userprofile.dto";
import { updateUserProfileResponse } from "@/application/dto/user/response/update.userprofile.dto";
import { UploadImageResponse } from "@/application/dto/user/response/upload.profileImage.dto";
import { IBaseUseCase } from "@/application/interfaces/base.usecase.interface";
import { ExperienceLevel } from "@/domain/constants/auth.constants";
import { HttpStatus } from "@/domain/constants/http.status.constants";
import { AUTH_MESSAGES, USER_MESSAGES } from "@/domain/constants/messages.constants";
import { changePasswordSchema } from "@/infrastructure/validators/user/change-password.validator";
import { updateUserProfileSchema } from "@/infrastructure/validators/user/user-profile.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";
import { ForbiddenError } from "@/shared/errors/forbidden.error";




export class UserController {
    constructor(
        private readonly _userProfileUseCase: IBaseUseCase<string, GetUserProfileResponse>,
        private readonly _userProfileUpdateUseCase: IBaseUseCase<UpdateUserProfileRequest, updateUserProfileResponse>,
        private readonly _uploadProfileImageUseCase: IBaseUseCase<UploadImageRequest, UploadImageResponse, UploadFileDTO>,
        private readonly _changePasswordUseCase: IBaseUseCase<ChangePasswordRequest, ChangePasswordResponse>,
        private readonly _getUserDashboardUseCase: IBaseUseCase<string, UserDashboardResponseDTO>
    ) { }

    async userProfile(req: Request, res: Response): Promise<Response> {
        const authenticatedSessionId = req.user?.id;
        if (!authenticatedSessionId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const targetUserId = req.body?.userId || req.body?.id || req.query?.userId || req.query?.id || req.params?.userId || req.params?.id || authenticatedSessionId;
        if (targetUserId !== authenticatedSessionId) {
            throw new ForbiddenError("You are not authorized to access this user profile.");
        }
        const result = await this._userProfileUseCase.execute(authenticatedSessionId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }

    async userProfileUpdate(req: Request, res: Response): Promise<Response> {
        const validatedata = updateUserProfileSchema.parse(req.body);
        const authenticatedSessionId = req.user?.id;
        if (!authenticatedSessionId) { 
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const targetUserId = req.body?.userId || req.body?.id || req.query?.userId || req.query?.id || req.params?.userId || req.params?.id || authenticatedSessionId;
        if (targetUserId !== authenticatedSessionId) {
            throw new ForbiddenError("You are not authorized to update this user profile.");
        }
        const dto = new UpdateUserProfileRequest({
            id: authenticatedSessionId,
            firstName: validatedata.firstName,
            lastName: validatedata.lastName,
            phone: validatedata.phone,
            preferredWorkouts: validatedata.preferredWorkouts,
            experienceLevel: validatedata.experienceLevel as ExperienceLevel
        });
        const result = await this._userProfileUpdateUseCase.execute(dto);

        return res.status(HttpStatus.OK).json(ApiResponse.success(result, USER_MESSAGES.PROFILE_UPDATED));
    }

    async uploadProfileImage(req: Request, res: Response): Promise<Response> {
        const authenticatedSessionId = req.user?.id;
        if (!authenticatedSessionId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const targetUserId = req.body?.userId || req.body?.id || req.query?.userId || req.query?.id || req.params?.userId || req.params?.id || authenticatedSessionId;
        if (targetUserId !== authenticatedSessionId) {
            throw new ForbiddenError("You are not authorized to update this user's profile image.");
        }
        if (!req.file) {
            throw new Error(AUTH_MESSAGES.FILE_NOT_FOUND);
        }
        const result = await this._uploadProfileImageUseCase.execute(
            { userId: authenticatedSessionId },
            req.file
        );
        return res.status(HttpStatus.OK).json(ApiResponse.success(result, AUTH_MESSAGES.PROFILE_IMAGE_UPDATED));
    }
    async ChangePassword(req: Request, res: Response): Promise<Response> {
        const authenticatedSessionId = req.user?.id;
        if (!authenticatedSessionId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.USER_NOT_FOUND));
        }
        const targetUserId = req.body?.userId || req.body?.id || req.query?.userId || req.query?.id || req.params?.userId || req.params?.id || authenticatedSessionId;
        if (targetUserId !== authenticatedSessionId) {
            throw new ForbiddenError("You are not authorized to change password for this user account.");
        }
        const validate = changePasswordSchema.parse(req.body);
        const result = await this._changePasswordUseCase.execute({
            userId: authenticatedSessionId,
            ...validate
        });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result, AUTH_MESSAGES.PASSWORD_UPDATE));
    }
    async getUserPremiumDashboard(req: Request, res: Response): Promise<Response> {
        const authenticatedSessionId = req.user?.id;
        if (!authenticatedSessionId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const targetUserId = req.body?.userId || req.body?.id || req.query?.userId || req.query?.id || req.params?.userId || req.params?.id || authenticatedSessionId;
        if (targetUserId !== authenticatedSessionId) {
            throw new ForbiddenError("You are not authorized to access this user's dashboard.");
        }
        const result = await this._getUserDashboardUseCase.execute(authenticatedSessionId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));

    }

}
