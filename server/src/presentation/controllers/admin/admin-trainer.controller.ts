import { Request, Response } from "express";
import { GetAllTrainersUseCase } from "@/application/usecases/admin/get-all-trainers.usecase";
import { GetUsersRequestDTO } from "@/application/dto/admin/request/get-users.dto";
import { TrainerBlockUseCase } from "@/application/usecases/admin/trainer-block.usecase";
import { BlockTrainerRequestDTO } from "@/application/dto/admin/request/block-trainer.dto";

export class AdminTrainerController {
  constructor(
    private readonly _getAllTrainersUseCase: GetAllTrainersUseCase,
    private readonly _trainerBlockUseCase: TrainerBlockUseCase
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
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}