import { Request, Response } from "express";
import { GetUsersRequestDTO } from "@/application/dto/admin/request/get-users.dto";
import { BlockTrainerRequestDTO } from "@/application/dto/admin/request/block-trainer.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GetTrainersRequestDTO } from "@/application/dto/admin/request/get-trainer.dto";
import { GetTrainersResponseDTO } from "@/application/dto/admin/response/get-trainers.dto";
import { BlockTrainerResponseDTO } from "@/application/dto/admin/response/block-trainer.dto";
import { HttpStatus } from "@/domain/constants/http-status.constants";

export class AdminTrainerController {
  constructor(
    private readonly _getAllTrainersUseCase: IBaseUseCase<GetTrainersRequestDTO,GetTrainersResponseDTO>,
    private readonly _trainerBlockUseCase: IBaseUseCase<BlockTrainerRequestDTO,BlockTrainerResponseDTO>
  ) {}

  async getAllTrainers(req: Request, res: Response) {
    try {
      const dto: GetUsersRequestDTO = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search as string,
        status: req.query.status as string,
      };

      const result = await this._getAllTrainersUseCase.execute(dto);
      return res.status(200).json({ success: true, data: result });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message });
    }
  }

async blockTrainer(req: Request, res: Response) {
    try {
      const dto: BlockTrainerRequestDTO = { userId: req.params.id };
      const result = await this._trainerBlockUseCase.execute(dto);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: error.message,
      });
    }
  }
}