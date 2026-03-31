import { BookSlotRequestDTO } from "@/application/dto/slot/request/book-slot.dto";
import { CancelBookingRequestDTO } from "@/application/dto/slot/request/cancel-slot.dto";
import { GetAvailableSlotsRequestDTO } from "@/application/dto/slot/request/get-slots.dto";
import { GetUserUpcomingRequestDTO } from "@/application/dto/slot/request/user-get-upcomingSlot.dto";
import { BookSlotResponseDTO } from "@/application/dto/slot/response/book-slot";
import { CancelBookingResponseDTO } from "@/application/dto/slot/response/cancel-slot";
import { AvailableSlotResponseDTO, AvailableSlotsPagedResponseDTO } from "@/application/dto/slot/response/get-slots.dto";
import { UserUpcomingResponseDTO } from "@/application/dto/slot/response/user-upcomingSlot.dto";
import { GetTrainersBookingRequestDTO } from "@/application/dto/user/request/get-trainerBooking.dto";
import { GetTrainersBookingResponseDTO } from "@/application/dto/user/response/get-trainerBooking.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES, SLOT_MESSAGES } from "@/domain/constants/messages.constants";
import { Request, Response } from "express";



export class UserSlotController {
    constructor(
        private readonly _getAvailableSlotsUseCase: IBaseUseCase<GetAvailableSlotsRequestDTO, AvailableSlotsPagedResponseDTO>,
        private readonly _bookSlotUseCase: IBaseUseCase<BookSlotRequestDTO, BookSlotResponseDTO>,
        private readonly _cancelSlotUseCase: IBaseUseCase<CancelBookingRequestDTO, CancelBookingResponseDTO>,
        private readonly _getUsersUpcomingUseCase: IBaseUseCase<GetUserUpcomingRequestDTO, UserUpcomingResponseDTO>,
        private readonly _getTrainerBookingUseCase: IBaseUseCase<GetTrainersBookingRequestDTO, GetTrainersBookingResponseDTO>
    ) { }
    async getAvailableSlot(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.UNAUTHORIZED
            });
        }
        const dto = new GetAvailableSlotsRequestDTO({
            userId: userId,
            page: Number(req.query.page) || 1,
            trainerId:req.query.trainerId as string | undefined,
            limit: Number(req.query.limit) || 10,
            search: req.query.search as string | undefined,
        });

        const result = await this._getAvailableSlotsUseCase.execute(dto);
        return res.status(HttpStatus.OK).json({
            success: true,
            data: result
        });

    }
    async userBookSlot(req: Request, res: Response): Promise<Response> {
        const { slotId } = req.params;
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.USER_NOT_FOUND
            });
        }
        await this._bookSlotUseCase.execute({ slotId, userId });
        return res.status(HttpStatus.OK).json({
            success: true,
            message: SLOT_MESSAGES.SLOT_BOOKING_SUCCESS,

        });


    }
    async cancelBooking(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.UNAUTHORIZED
            });
        }
        const { slotId } = req.params;
        const result = await this._cancelSlotUseCase.execute({ slotId, userId });
        return res.status(HttpStatus.OK).json(result);
    }
    async UpcomingSessionSlots(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        const dto = new GetUserUpcomingRequestDTO({
            userId: userId!,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        });
        const result = await this._getUsersUpcomingUseCase.execute(dto);
        return res.status(HttpStatus.OK).json({
            success: true,
            data: result
        });
    }
    async getTrainer(req: Request, res: Response): Promise<Response> {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success: false,
                message: AUTH_MESSAGES.UNAUTHORIZED
            });
        }
        const dto = new GetTrainersBookingRequestDTO({
            userId,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10,
            search: req.query.search as string | undefined
        });
        const result = await this._getTrainerBookingUseCase.execute(dto);
        return res.status(HttpStatus.OK).json({
            success:true,
            data:result
        });
    }


}