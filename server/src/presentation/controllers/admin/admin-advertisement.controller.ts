import { CreateAdvertismentRequest } from "@/application/dto/advertisement/request/create-advertisement.dto";
import { GetAdvertisementByIdRequest } from "@/application/dto/advertisement/request/get-AdvertisementByid.dto";
import { GetAllAdvertismentRequest } from "@/application/dto/advertisement/request/get-allAdvertisement.dto";
import { UpdateAdvertismentRequest } from "@/application/dto/advertisement/request/update-advertisement.dto";
import { UpdateStatusAdvertisementRequestDTO } from "@/application/dto/advertisement/request/updateStatus-advertisement.dto";
import { CreateAdvertismentResponse } from "@/application/dto/advertisement/response/create-advertisement.dto";
import { GetAdvertisementByIdResponse } from "@/application/dto/advertisement/response/get-advertisementById.dto";
import { GetAllAdvertismentResponse } from "@/application/dto/advertisement/response/get-allAdvertisment.dto";
import { UpdateAdvertismentResponse } from "@/application/dto/advertisement/response/update-advetisement.dto";
import {UpdateStatusAdvertisementResponseDTO } from "@/application/dto/advertisement/response/updateStatus-advertisment.dto";
import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { AdvertisementStatus } from "@/domain/constants/advertisment.constants";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { ADVERTISEMENT_MESSAGES } from "@/domain/constants/messages.constants";
import { CreateAdvertisementSchema } from "@/infrastructure/validators/admin/advertisement.validator";
import { UpdateAdvertisementSchema } from "@/infrastructure/validators/admin/update-advertisement.validators";
import { Request, Response } from "express";


export class AdvertisementController{
    constructor(
        private readonly _createAdvertisementUseCase: IBaseUseCase<CreateAdvertismentRequest,CreateAdvertismentResponse,UploadFileDTO[]>,
        private readonly _updateAdvertisementUseCase: IBaseUseCase<UpdateAdvertismentRequest,UpdateAdvertismentResponse,UploadFileDTO[]>,
        private readonly _getAllAdvertisementUseCase: IBaseUseCase<GetAllAdvertismentRequest,GetAllAdvertismentResponse>,
        private readonly _updateStatusAdvertisementUseCase: IBaseUseCase<UpdateStatusAdvertisementRequestDTO,UpdateStatusAdvertisementResponseDTO>,
        private readonly _getAdvertisementByIdUseCase: IBaseUseCase<GetAdvertisementByIdRequest,GetAdvertisementByIdResponse>
    ){}
    async createAdvertisement(req:Request,res:Response):Promise<Response>{
        const dto = CreateAdvertisementSchema.parse(req.body);
        const files = req.files as Express.Multer.File[];
        if(!files || files.length ===0){
            return res.status(HttpStatus.BAD_REQUEST).json({message:ADVERTISEMENT_MESSAGES.NO_IMAGES_UPLOADED});
        }
       const uploadFiles:UploadFileDTO[]=files.map(file=>({
         buffer:file.buffer,
        originalname:file.originalname,
        mimetype:file.mimetype,
        size:file.size
        
       }));
        const result = await this._createAdvertisementUseCase.execute(dto,uploadFiles);
        return res.status(HttpStatus.OK).json(result);
    }
    async updateAdvertisement(req:Request,res:Response):Promise<Response>{
   const updateinput = {
    ...req.body,
    id:req.params.id
   };
   const validatedData = UpdateAdvertisementSchema.parse(updateinput);
   const dto = new UpdateAdvertismentRequest(validatedData);
   const files = req.files as Express.Multer.File[];
   const uploadfiles = files?.map(file=>({
    buffer:file.buffer,
    originalname:file.originalname,
    mimetype:file.mimetype,
    size:file.size
   }));
   const result = await this._updateAdvertisementUseCase.execute(dto,uploadfiles);
   return res.status(HttpStatus.OK).json(result);
    }
 async  getAllAdvertisement(req:Request,res:Response):Promise<Response>{
    const dto = new GetAllAdvertismentRequest({
        page:Number(req.query.number) || 1,
        limit:Number(req.query.limit) || 10,
        search:req.query.search as string,
        status:req.query.status as AdvertisementStatus
    });
    const result = await this._getAllAdvertisementUseCase.execute(dto);
    return res.status(HttpStatus.OK).json({
        success:true,
        data:result
    });
 }
 async updateStatusAdvertisement(req:Request,res:Response):Promise<Response>{


    const dto = new UpdateStatusAdvertisementRequestDTO({
        adId:req.params.adId
    });
    const result = await this._updateStatusAdvertisementUseCase.execute(dto);
    return res.status(HttpStatus.OK).json({
        success:true,
        data:result
    });
 };
 async getAdvertisementById(req:Request,res:Response):Promise<Response>{
    const dto =new GetAdvertisementByIdRequest({adId:req.params.id});
    const result = await this._getAdvertisementByIdUseCase.execute(dto);
    return res.status(HttpStatus.OK).json({
        success:true,
        data:result
    });

 }
}