import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { ChangePasswordRequest } from "@/application/dto/user/request/change-password.dto";
import { UpdateUserProfileRequest } from "@/application/dto/user/request/update-userProfie.dto";
import { UploadImageRequest } from "@/application/dto/user/request/upload-profileImage.dto";
import { ChangePasswordResponse } from "@/application/dto/user/response/change-password.dto";
import { GetUserProfileResponse } from "@/application/dto/user/response/get-userProfile.dto";
import { updateUserProfileResponse } from "@/application/dto/user/response/update-userProfile.dto";
import { UploadImageResponse } from "@/application/dto/user/response/upload-profileImage.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { changePasswordSchema } from "@/infrastructure/validators/user/change-password.validator";
import { Request, Response } from "express";




export  class  UserController {
    constructor(
        private readonly _userProfileUseCase: IBaseUseCase<string, GetUserProfileResponse>,
        private readonly _userProfileUpdateUseCase:IBaseUseCase<UpdateUserProfileRequest,updateUserProfileResponse>,
        private readonly _uploadProfileImageUseCase:IBaseUseCase<UploadImageRequest,UploadImageResponse,UploadFileDTO>,
        private readonly _changePasswordUseCase:IBaseUseCase<ChangePasswordRequest,ChangePasswordResponse>
    ){}

    async userProfile(req:Request,res:Response):Promise<Response>{
        const userId = req.user?.userId;
        if(!userId){
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success:false,
                messsage:AUTH_MESSAGES.UNAUTHORIZED
            });
        }
        const result = await this._userProfileUseCase.execute(userId);
        return res.status(HttpStatus.OK).json({
            success:true,
            data:result
        });
    }

    async userProfileUpdate(req:Request,res:Response):Promise<Response>{
        const userId = req.user?.userId;
        if(!userId){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        const {firstName,lastName,phone,preferredWorkouts,experienceLevel}=req.body;
        const result = await this._userProfileUpdateUseCase.execute({
            id:userId,
            firstName,
            lastName,
            phone,
            preferredWorkouts,
            experienceLevel
        });
        return res.status(HttpStatus.OK).json({
            success:true,
            data:result
        });
    }

    async uploadProfileImage(req:Request,res:Response):Promise<Response>{
        const userId = req.user?.userId;
        if(!userId){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
        if(!req.file){
            throw new Error(AUTH_MESSAGES.FILE_NOT_FOUND);
        }
        const result= await this._uploadProfileImageUseCase.execute(
           {userId},
           req.file
    );
        return res.status(HttpStatus.OK).json({
           success:true,
           data:result
        });
    }
    async ChangePassword(req:Request,res:Response):Promise<Response>{
        const userId = req.user?.userId;
        if(!userId){
            throw new Error(AUTH_MESSAGES.USER_NOT_FOUND);
        }
       const validate = changePasswordSchema.parse(req.body);
        const result = await this._changePasswordUseCase.execute({
            userId,
            ...validate
        });
        return res.status(HttpStatus.OK).json({
            success:true,
            data:result
        });
    }
}