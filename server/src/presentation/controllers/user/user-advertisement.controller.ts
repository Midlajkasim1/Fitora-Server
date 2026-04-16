import { GetActiveAdversitsementResponsetDTO } from "@/application/dto/advertisement/response/get-activeAdvertisement.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";


export class UserAdvertisementController{
constructor(
    private readonly _getActiveAdvertisementUseCase:IBaseUseCase<void,GetActiveAdversitsementResponsetDTO>,
){}
 async getAdvertisement(req:Request,res:Response):Promise<Response>{
    const result = await this._getActiveAdvertisementUseCase.execute();
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
 }

}