import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { CreateSpecializationDTO } from "@/application/dto/specialization/request/create-specialization.dto";
import { GetSpecializationRequest } from "@/application/dto/specialization/request/get-specialization.dto";
import { GetSpecializationByIdRequestDTO } from "@/application/dto/specialization/request/get-specializationById.dto";
import { UpdateSpecializationDTO } from "@/application/dto/specialization/request/update-specialization.dto";
import { UpdateStatusRequestDTO } from "@/application/dto/specialization/request/updateStatus-specialization.dto";
import { CreateSpecializationResponseDTO } from "@/application/dto/specialization/response/create-specialization.dto";
import { GetSpecializationResponseDTO } from "@/application/dto/specialization/response/get-specialization.dto";
import { GetSpecializationByIdResponseDTO } from "@/application/dto/specialization/response/get-specializationById.dto";
import { UpdateSpecializationResponseDTO } from "@/application/dto/specialization/response/update-specialization.dto";
import { UpdateStatusResponseDTO } from "@/application/dto/specialization/response/updateStatus-specialization.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SpecializationStatus } from "@/domain/constants/auth.constants";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { SPECIALIZATION_MESSAGES } from "@/domain/constants/messages.constants";
import { SpecializationSchema } from "@/infrastructure/validators/admin/specialization.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";



export class SpecializationController {
  constructor(
    private readonly _createSpecializationUseCase: IBaseUseCase<CreateSpecializationDTO, CreateSpecializationResponseDTO, UploadFileDTO>,
    private readonly _updateSpecializationUseCase: IBaseUseCase<UpdateSpecializationDTO, UpdateSpecializationResponseDTO, UploadFileDTO>,
    private readonly _getAllSpecializationUseCase: IBaseUseCase<GetSpecializationRequest, GetSpecializationResponseDTO>,
    private readonly _blockSpecializationUseCase: IBaseUseCase<UpdateStatusRequestDTO, UpdateStatusResponseDTO>,
    private readonly _getSpecializationByIdUseCase: IBaseUseCase<GetSpecializationByIdRequestDTO, GetSpecializationByIdResponseDTO>
  ) { }
  async createSpecialization(req: Request, res: Response): Promise<Response> {

    const dto = SpecializationSchema.parse(req.body);
    const file = req.file as Express.Multer.File;

    const uploadedFile = file && {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    const result = await this._createSpecializationUseCase.execute(dto, uploadedFile);

    return res.status(HttpStatus.OK).json(ApiResponse.success(result, SPECIALIZATION_MESSAGES.SPECIALIZATION_CREATED));


  }

  async updateSpecialization(req: Request, res: Response): Promise<Response> {

    const { id } = req.params;

    const dto = SpecializationSchema.parse(req.body);
    const file = req.file as Express.Multer.File;
    const uploadedFile = file && {

      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size

    };
    const result = await this._updateSpecializationUseCase.execute({ ...dto, id }, uploadedFile);
    return res.status(HttpStatus.CREATED).json(ApiResponse.success(result, SPECIALIZATION_MESSAGES.SPECIALIZATION_UPDATED));

  }

  async getAllSpecialization(req: Request, res: Response): Promise<Response> {
    const dto = new GetSpecializationRequest({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status: req.query.status as SpecializationStatus.ACTIVE | SpecializationStatus.BLOCKED | undefined
    });
    const result = await this._getAllSpecializationUseCase.execute(dto);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));

  }
  async BlockSpecialization(req: Request, res: Response): Promise<Response> {
    const dto = new UpdateStatusRequestDTO({ specializationId: req.params.specializationId });
    const result = await this._blockSpecializationUseCase.execute(dto);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
  async GetSingleSpecialization(req: Request, res: Response): Promise<Response> {
    const dto = new GetSpecializationByIdRequestDTO({ id: req.params.id });
    const result = await this._getSpecializationByIdUseCase.execute(dto);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
  async getActiveSpecialization(req: Request, res: Response): Promise<Response> {
    const dto: GetSpecializationRequest = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status: SpecializationStatus.ACTIVE
    };
    const result = await this._getAllSpecializationUseCase.execute(dto);
    return res.status(HttpStatus.OK).json(ApiResponse.success(result));
  }
}