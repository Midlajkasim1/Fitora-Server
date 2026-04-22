import { CreateSlotRequestDTO } from "@/application/dto/slot/request/create-slot.dto";
import { TrainerCancelSlotRequestDTO } from "@/application/dto/slot/request/trainer-cancel-slot.dto";
import { TrainerEditSlotRequestDTO } from "@/application/dto/slot/request/trainer-edit-slot.dto";
import { GetTrainerUsersRequestDTO } from "@/application/dto/slot/request/trainer-get-bookedUser.dto";
import { GetTrainerUpcomingSlotRequestDTO } from "@/application/dto/slot/request/trainer-get-upcomingSlot.dto";
import { CreateSlotResponseDTO } from "@/application/dto/slot/response/create-slot.dto";
import { TrainerCancelSlotResponseDTO } from "@/application/dto/slot/response/trainer-cancel-slot";
import { EditSlotResponseDTO } from "@/application/dto/slot/response/trainer-edit-slot.dto";
import { GetTrainerStudentResponseDTO } from "@/application/dto/slot/response/trainer-get-bookedUser.dto";
import { TrainerUpcomingResponseDTO } from "@/application/dto/slot/response/trainer-get-upcomingSlot.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES, SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { SlotSchema } from "@/infrastructure/validators/user/trainer/trainer-slot.validator";
import { ApiResponse } from "@/shared/utils/response.handler";
import { Request, Response } from "express";
import { GetClientDetailsRequestDTO, ClientDetailsOutput } from "@/application/usecases/trainer/get-client-details.usecase";


export class TrainerSlotController {
    constructor(
        private readonly _createSlotUseCase: IBaseUseCase<CreateSlotRequestDTO, CreateSlotResponseDTO>,
        private readonly _editSlotUseCase: IBaseUseCase<TrainerEditSlotRequestDTO, EditSlotResponseDTO>,
        private readonly _cancelSlotUseCase: IBaseUseCase<TrainerCancelSlotRequestDTO, TrainerCancelSlotResponseDTO>,
        private readonly _getOneOnOneUserUseCase: IBaseUseCase<GetTrainerUsersRequestDTO, GetTrainerStudentResponseDTO>,
        private readonly _getGroupUsersUseCase: IBaseUseCase<GetTrainerUsersRequestDTO, GetTrainerStudentResponseDTO>,
        private readonly _getTrainerUpcomingUseCase: IBaseUseCase<GetTrainerUpcomingSlotRequestDTO, TrainerUpcomingResponseDTO>,
        private readonly _getClientDetailsUseCase: IBaseUseCase<GetClientDetailsRequestDTO, ClientDetailsOutput>

    ) { }

    async getClientDetails(req: Request, res: Response): Promise<Response> {
        const { clientId } = req.params;
        const trainerId = req.user?.userId;
        if (!trainerId) {
            return res.status(HttpStatus.UNAUTHORIZED).json(ApiResponse.error(AUTH_MESSAGES.TRAINER_ID_NOT_FOUND));
        }

        try {
            const result = await this._getClientDetailsUseCase.execute({ trainerId, clientId });
            return res.status(HttpStatus.OK).json(ApiResponse.success(result));
        } catch (error) {
            return res.status(HttpStatus.BAD_REQUEST).json(ApiResponse.error((error as Error).message));
        }
    }
    async createSlot(req: Request, res: Response): Promise<Response> {
        const validateData = SlotSchema.parse(req.body);
        const trainerId = req.user?.userId;
        if (!trainerId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.TRAINER_ID_NOT_FOUND));
        }
        const dto: CreateSlotRequestDTO = {
            trainerId: trainerId,
            startTime: new Date(validateData.startTime),
            endTime: new Date(validateData.endTime),
            type: validateData.type,
            capacity: validateData.capacity
        };
        const result = await this._createSlotUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result, SLOT_MESSAGES.SLOT_CREATED_SUCESSFULLY));

    }
    async editSlot(req: Request, res: Response): Promise<Response> {
        const { slotId } = req.params;
        const trainerId = req.user?.userId;
        if (!trainerId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.TRAINER_ID_NOT_FOUND));
        }
        const validateData = SlotSchema.parse(req.body);

        const dto = new TrainerEditSlotRequestDTO({
            slotId,
            trainerId,
            startTime: new Date(validateData.startTime),
            endTime: new Date(validateData.endTime),
            type: validateData.type,
            capacity: validateData.capacity as number
        });

        const result = await this._editSlotUseCase.execute(dto);

        return res.status(HttpStatus.OK).json(ApiResponse.success(result,result.message));
    }

    async cancelSlot(req: Request, res: Response): Promise<Response> {
        const { slotId } = req.params;
        const trainerId = req.user?.userId;
         if (!trainerId) {
            return res
                .status(HttpStatus.UNAUTHORIZED)
                .json(ApiResponse.error(AUTH_MESSAGES.TRAINER_ID_NOT_FOUND));
        }
        const result = await this._cancelSlotUseCase.execute({ slotId, trainerId });
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
    async getPersonalUsers(req: Request, res: Response): Promise<Response> {
        const trainerId = req.user?.userId;
        const dto = new GetTrainerUsersRequestDTO({
            trainerId: trainerId!,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search as string
        });
        const result = await this._getOneOnOneUserUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));


    }
    async getGroupUsers(req: Request, res: Response): Promise<Response> {
        const trainerId = req.user?.userId;

        const dto = new GetTrainerUsersRequestDTO({
            trainerId: trainerId!,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search as string
        });
        const result = await this._getGroupUsersUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));
    }
    async getTrainerUpcomingSlots(req: Request, res: Response): Promise<Response> {
        const trainerId = req.user?.userId;
        const dto = new GetTrainerUpcomingSlotRequestDTO({
            trainerId: trainerId!,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        });
        const result = await this._getTrainerUpcomingUseCase.execute(dto);
        return res.status(HttpStatus.OK).json(ApiResponse.success(result));

    }

}
