import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { UpdateTrainerProfileRequest } from "@/application/dto/trainer/request/update-trainer-profile.dto";
import { UploadTrainerImageRequest } from "@/application/dto/trainer/request/upload-trainerProfile.dto";
import { GetTrainerProfileResponse } from "@/application/dto/trainer/response/get-trainerProfile.dto";
import { TrainerDashboardResponseDTO } from "@/application/dto/trainer/response/trainer-dashboard.dto";
import { UpdateTrainerProfileResponseDTO } from "@/application/dto/trainer/response/update-trainerProfile.dto";
import { UploadTrainerImageResponse } from "@/application/dto/trainer/response/upload-trainerProfileimage.dto";
import { ChangePasswordRequest } from "@/application/dto/user/request/change-password.dto";
import { ChangePasswordResponse } from "@/application/dto/user/response/change-password.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES, TRAINER_MESSAGES, FINANCE_MESSAGES } from "@/domain/constants/messages.constants";
import { changePasswordSchema } from "@/infrastructure/validators/user/change-password.validator";
import { updateTrainerProfileSchema } from "@/infrastructure/validators/user/trainer/trainer-profile.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";
import { TrainerWalletResponse, GetTrainerWalletRequest } from "@/application/usecases/trainer/get-trainer-wallet.usecase";
import { RequestPayoutDTO } from "@/application/usecases/trainer/request-payout.usecase";


export class TrainerController {
    constructor(
        private readonly _getTrainerDashboardUseCase: IBaseUseCase<string, TrainerDashboardResponseDTO>,
        private readonly _getTrainerProfileUseCase: IBaseUseCase<string, GetTrainerProfileResponse>,
        private readonly _uploadTrainerImageUseCase: IBaseUseCase<UploadTrainerImageRequest, UploadTrainerImageResponse, UploadFileDTO>,
        private readonly _updateTrainerProfileUseCase: IBaseUseCase<UpdateTrainerProfileRequest, UpdateTrainerProfileResponseDTO>,
        private readonly _changePasswordUseCase: IBaseUseCase<ChangePasswordRequest, ChangePasswordResponse>,
        private readonly _getTrainerWalletUseCase: IBaseUseCase<GetTrainerWalletRequest, TrainerWalletResponse>,
        private readonly _requestPayoutUseCase: IBaseUseCase<RequestPayoutDTO, void>
    ) { }
    async getTrainerDashboard(req: Request, res: Response): Promise<Response> {
        const trainerId = req.user?.userId;
        if (!trainerId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const dashboarddata = await this._getTrainerDashboardUseCase.execute(trainerId!);
        return res.status(HttpStatus.OK).json(ApiResponse.success(dashboarddata));
    }
    async getTrainerProfile(req: Request, res: Response): Promise<Response> {
        const userId = req?.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const result = await this._getTrainerProfileUseCase.execute(userId);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
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
        const result = await this._uploadTrainerImageUseCase.execute(
            { userId },
            req.file
        );
        return res.status(HttpStatus.OK).json(ApiResponse.success(result,TRAINER_MESSAGES.PROFILE_UPLOADED));
    }
    async TrainerProfileUpdate(req: Request, res: Response): Promise<Response> {
        const validatedata = updateTrainerProfileSchema.parse(req.body);
        const userId = req.user?.userId;
        if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const dto = new UpdateTrainerProfileRequest({
            id: userId,
            firstName:validatedata.firstName as string,
            lastName:validatedata.lastName as string,
            phone:validatedata.phone,
            experience_year:validatedata.experience_year
        });
        const result = await this._updateTrainerProfileUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result,TRAINER_MESSAGES.PROFILE_UPDATED));
    }
        async ChangePassword(req:Request,res:Response):Promise<Response>{
            const userId = req.user?.userId;
           if (!userId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
           const validate = changePasswordSchema.parse(req.body);
            const result = await this._changePasswordUseCase.execute({
                userId,
                ...validate
            });
            return res.status(HttpStatus.OK).json(ApiResponse.success(result,AUTH_MESSAGES.PASSWORD_UPDATE));
        }

    async getTrainerWallet(req: Request, res: Response): Promise<Response> {
        const trainerId = req.user?.userId;
        if (!trainerId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        
        const walletData = await this._getTrainerWalletUseCase.execute({ trainerId, page, limit });
        return res.status(HttpStatus.OK).json(ApiResponse.success(walletData));
    }

    async requestPayout(req: Request, res: Response): Promise<Response> {
        const trainerId = req.user?.userId;
        if (!trainerId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.UNAUTHORIZED));
        }
        const { amount } = req.body;
        await this._requestPayoutUseCase.execute({ trainerId, amount });
        return res.status(HttpStatus.OK).json(ApiResponse.success(null, FINANCE_MESSAGES.PAYOUT_SUBMITTED));
    }
}
