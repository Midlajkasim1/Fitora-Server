import { UploadFileDTO } from "@/application/dto/auth/onboarding/request/trainer-upload-file.dto";
import { CreateSpecializationDTO } from "@/application/dto/specialization/request/create-specialization.dto";
import { UpdateSpecializationDTO } from "@/application/dto/specialization/request/update-specialization.dto";
import { CreateSpecializationResponseDTO } from "@/application/dto/specialization/response/create-specialization.dto";
import { UpdateSpecializationResponseDTO } from "@/application/dto/specialization/response/update-specialization.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { SpecializationSchema } from "@/infrastructure/validators/admin/specialization.validator";
import { Request, Response } from "express";



export class SpecializationController {
    constructor(
        private readonly _createSpecializationUseCase: IBaseUseCase<CreateSpecializationDTO, CreateSpecializationResponseDTO, UploadFileDTO>,
        private readonly _updateSpecializationUseCase: IBaseUseCase<UpdateSpecializationDTO, UpdateSpecializationResponseDTO, UploadFileDTO>
    ) { }
    async createSpecialization(req: Request, res: Response): Promise<Response> {
        try {
            const dto = SpecializationSchema.parse(req.body);
            const file = req.file as Express.Multer.File;

            const uploadedFile = file && {
                buffer: file.buffer,
                originalname: file.originalname,
                mimetype: file.mimetype,
                size: file.size,
            };

            const result = await this._createSpecializationUseCase.execute(dto, uploadedFile);

            return res.status(HttpStatus.OK).json(result);
        } catch (error: any) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: error.message,
            });
        }

    }

    async updateSpecialization(req: Request, res: Response): Promise<Response> {
        try {
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
            return res.status(HttpStatus.CREATED).json(result);
        } catch (error: any) {
            return res.status(HttpStatus.NOT_FOUND).json({
                success: false,
                message: error.message
            });
        }
    }

}