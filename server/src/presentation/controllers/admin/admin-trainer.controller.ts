import { Request, Response } from "express";
import { BlockTrainerRequestDTO } from "@/application/dto/admin/request/block-trainer.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GetTrainersRequestDTO } from "@/application/dto/admin/request/get-trainer.dto";
import { GetTrainersResponseDTO } from "@/application/dto/admin/response/get-trainers.dto";
import { BlockTrainerResponseDTO } from "@/application/dto/admin/response/block-trainer.dto";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { ApprovalStatus, UserStatus } from "@/domain/constants/auth.constants";
import { GetTrainerVerificationResponseDTO } from "@/application/dto/admin/response/get-trainerVerfication.dto";
import { GetTrainerVerificationRequestDTO } from "@/application/dto/admin/request/get-trainerVerfication.dto";
import { UpdateTrainerApprovalResponseDTO } from "@/application/dto/admin/response/update-trainerApproval.dto";
import { UpdateTrainerApprovalRequestDTO } from "@/application/dto/admin/request/update-trainerApproval.dto";
import { ADMIN_MESSAGES } from "@/domain/constants/messages.constants";
import { GetTrainerVerificationByIdRequestDTO } from "@/application/dto/admin/request/get-TrainerverificationById.dto";
import { GetTrainerVerificationByIdResponseDTO } from "@/application/dto/admin/response/get-trainerVerificationById.dto";
import { ApiResponse } from "@/shared/utils/response.handler";

export class AdminTrainerController {
  constructor(
    private readonly _getAllTrainersUseCase: IBaseUseCase<GetTrainersRequestDTO,GetTrainersResponseDTO>,
    private readonly _trainerBlockUseCase: IBaseUseCase<BlockTrainerRequestDTO,BlockTrainerResponseDTO>,
    private readonly _getTrainerVerificationUseCase:IBaseUseCase<GetTrainerVerificationRequestDTO,GetTrainerVerificationResponseDTO>,
    private readonly _updateTrainerApprovalStatusUseCase:IBaseUseCase<UpdateTrainerApprovalRequestDTO,UpdateTrainerApprovalResponseDTO>,
    private readonly _getTrainerVerificationByIdUseCase:IBaseUseCase<GetTrainerVerificationByIdRequestDTO,GetTrainerVerificationByIdResponseDTO>
  ) {}

  async getAllTrainers(req: Request, res: Response):Promise<Response> {
   
      const dto: GetTrainersRequestDTO = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search as string,
        status: req.query.status as UserStatus.ACTIVE | UserStatus.BLOCKED ,
        specialization:req.query.specialization  as string
      };

      const result = await this._getAllTrainersUseCase.execute(dto);
      return res.status(HttpStatus.OK).json(ApiResponse.success(result));
   
  }

async blockTrainer(req: Request, res: Response):Promise<Response> {
    
      const dto: BlockTrainerRequestDTO = { userId: req.params.id };
      const result = await this._trainerBlockUseCase.execute(dto);

      return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  
  };
  async getTrainerVerifications(req: Request, res: Response):Promise<Response> {

  const dto = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search as string,
    approvalStatus: req.query.status as ApprovalStatus.APPROVED | ApprovalStatus.REJECTED | ApprovalStatus.PENDING
 };

  const result = await this._getTrainerVerificationUseCase.execute(dto);

  return res.status(200).json(ApiResponse.success(result));
}
async updateTrainerApprovalStatus(req:Request,res:Response):Promise<Response>{
  const dto ={
    trainerDetailId:req.params.id,
    status:req.body.status as ApprovalStatus,
    reason:req.body.reason
  };
  await this._updateTrainerApprovalStatusUseCase.execute(dto);
 return  res.status(HttpStatus.OK).json(ApiResponse.success(null,ADMIN_MESSAGES.TRAINER_APPROVAL_DONE));
}
async getSingleTrainerVerification(req:Request,res:Response):Promise<Response>{
  const id = req.params.id;
  const result = await this._getTrainerVerificationByIdUseCase.execute({id});
  return res.status(HttpStatus.OK).json(ApiResponse.success(result));

}

}