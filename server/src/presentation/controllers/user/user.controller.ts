import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { ChangePasswordRequest } from "@/application/dto/user/request/change-password.dto";
import { UpdateUserProfileRequest } from "@/application/dto/user/request/update-userProfie.dto";
import { UploadImageRequest } from "@/application/dto/user/request/upload-profileImage.dto";
import { ChangePasswordResponse } from "@/application/dto/user/response/change-password.dto";
import { UserDashboardResponseDTO } from "@/application/dto/user/response/dashboard.dto";
import { GetUserProfileResponse } from "@/application/dto/user/response/get-userProfile.dto";
import { updateUserProfileResponse } from "@/application/dto/user/response/update-userProfile.dto";
import { UploadImageResponse } from "@/application/dto/user/response/upload-profileImage.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { ExperienceLevel } from "@/domain/constants/auth.constants";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES, USER_MESSAGES } from "@/domain/constants/messages.constants";
import { changePasswordSchema } from "@/infrastructure/validators/user/change-password.validator";
import { updateUserProfileSchema } from "@/infrastructure/validators/user/user-profile.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";




export class UserController {
    constructor(
        private readonly _userProfileUseCase: IBaseUseCase<string, GetUserProfileResponse>,
        private readonly _userProfileUpdateUseCase: IBaseUseCase<UpdateUserProfileRequest, updateUserProfileResponse>,
        private readonly _uploadProfileImageUseCase: IBaseUseCase<UploadImageRequest, UploadImageResponse, UploadFileDTO>,
        private readonly _changePasswordUseCase: IBaseUseCase<ChangePasswordRequest, ChangePasswordResponse>,
        private readonly _getUserDashboardUseCase: IBaseUseCase<string, UserDashboardResponseDTO>
    ) { }

    async userProfile(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const result = await this._userProfileUseCase.execute(userId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }

    async userProfileUpdate(req: Request, res: Response): Promise<Response> {
        const validatedata = updateUserProfileSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const dto = new UpdateUserProfileRequest({
            id: userId!,
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
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        if (!req.file) {
            throw new Error(AUTH_MESSAGES.FILE_NOT_FOUND);
        }
        const result = await this._uploadProfileImageUseCase.execute(
            { userId },
            req.file
        );
        return res.status(HttpStatus.OK).json(ApiResponse.success(result, AUTH_MESSAGES.PROFILE_IMAGE_UPDATED));
    }
    async ChangePassword(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.USER_NOT_FOUND));
        }
        const validate = changePasswordSchema.parse(req.body);
        const result = await this._changePasswordUseCase.execute({
            userId,
            ...validate
        });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result, AUTH_MESSAGES.PASSWORD_UPDATE));
    }
    async getUserPremiumDashboard(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const result = await this._getUserDashboardUseCase.execute(userId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));

    }

}
