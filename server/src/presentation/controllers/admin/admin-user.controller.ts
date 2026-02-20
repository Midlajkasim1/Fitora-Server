import { Request, Response } from "express";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { GetUsersRequestDTO } from "@/application/dto/admin/request/get-users.dto";
import { BlockUserRequestDTO } from "@/application/dto/admin/request/block-user.dto";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { GetUsersResponseDTO } from "@/application/dto/admin/response/get-users.dto";
import { BlockUserResponseDTO } from "@/application/dto/admin/response/block-user.dto";

export class AdminUserController {
  constructor(
    private readonly _getAllUsersUseCase: IBaseUseCase<GetUsersRequestDTO,GetUsersResponseDTO>,
    private readonly _userBlockUsecase: IBaseUseCase<BlockUserRequestDTO,BlockUserResponseDTO>,
  ) { }

  async getUsers(req: Request, res: Response): Promise<Response> {
    try {
      const dto: GetUsersRequestDTO = {
        page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search as string,
        status: req.query.status as any,
      };

      const result = await this._getAllUsersUseCase.execute(dto);

      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: error.message || AUTH_MESSAGES.FAILED_FETCH_USER,
      });
    }
  }
  async blockUser(req: Request, res: Response) {
    try {
      const dto: BlockUserRequestDTO = { userId: req.params.id };
      const result = await this._userBlockUsecase.execute(dto);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      return res.status(error.statusCode || 400).json({
        success: false,
        message: error.message,
      });
    }
  }



}