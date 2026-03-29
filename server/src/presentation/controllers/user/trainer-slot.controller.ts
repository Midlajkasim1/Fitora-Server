import { CreateSlotRequestDTO } from "@/application/dto/slot/request/create-slot.dto";
import { TrainerCancelSlotRequestDTO } from "@/application/dto/slot/request/trainer-cancel-slot.dto";
import { GetTrainerUsersRequestDTO } from "@/application/dto/slot/request/trainer-get-bookedUser.dto";
import { GetTrainerUpcomingSlotRequestDTO } from "@/application/dto/slot/request/trainer-get-upcomingSlot.dto";
import { CreateSlotResponseDTO } from "@/application/dto/slot/response/create-slot.dto";
import { TrainerCancelSlotResponseDTO } from "@/application/dto/slot/response/trainer-cancel-slot";
import { GetTrainerStudentResponseDTO } from "@/application/dto/slot/response/trainer-get-bookedUser.dto";
import { TrainerUpcomingResponseDTO } from "@/application/dto/slot/response/trainer-get-upcomingSlot.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { createSlotSchema } from "@/infrastructure/validators/user/trainer-slot.validator";
import { Request, Response } from "express";


export class TrainerSlotController {
    constructor(
        private readonly  _createSlotUseCase:IBaseUseCase<CreateSlotRequestDTO,CreateSlotResponseDTO>,
        private readonly _cancelSlotUseCase:IBaseUseCase<TrainerCancelSlotRequestDTO,TrainerCancelSlotResponseDTO>,
        private readonly _getOneOnOneUserUseCase:IBaseUseCase<GetTrainerUsersRequestDTO,GetTrainerStudentResponseDTO>,
        private readonly _getGroupUsersUseCase:IBaseUseCase<GetTrainerUsersRequestDTO,GetTrainerStudentResponseDTO>,
        private readonly _getTrainerUpcomingUseCase: IBaseUseCase<GetTrainerUpcomingSlotRequestDTO, TrainerUpcomingResponseDTO>

    ){} 
    async  createSlot(req:Request,res:Response):Promise<Response>{
        const validateData = createSlotSchema.parse(req.body);
        const trainerId = req.user?.userId;
        if(!trainerId){
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success:false,
                message:AUTH_MESSAGES.TRAINER_ID_NOT_FOUND
            });
        }
          const dto :CreateSlotRequestDTO={
             trainerId:trainerId,
             startTime:new Date(validateData.startTime),
             endTime:new Date(validateData.endTime),
             type:validateData.type,
             capacity:validateData.capacity
            };
          const result =  await this._createSlotUseCase.execute(dto);
          return res.status(HttpStatus.OK).json({
            success:true,
            data:result
          });
         
    }
    async cancelSlot(req:Request,res:Response):Promise<Response>{
        const {slotId}=req.params;
        const trainerId = req.user?.userId;
        if(!trainerId){
            return res.status(HttpStatus.UNAUTHORIZED).json({
                success:false,
                message:AUTH_MESSAGES.UNAUTHORIZED
            });
        }
    const result =   await this._cancelSlotUseCase.execute({slotId,trainerId});
        return res.status(HttpStatus.OK).json({
            success:true,
            data:result
            
        });
    }
    async getPersonalUsers(req:Request,res:Response):Promise<Response>{
        const trainerId = req.user?.userId;
        const dto = new GetTrainerUsersRequestDTO({
            trainerId:trainerId!,
            page:Number(req.query.page) || 1,
            limit:Number(req.query.limit) || 10,
            search:req.query.search as string
        });
        const result = await this._getOneOnOneUserUseCase.execute(dto);
        return res.status(HttpStatus.OK).json({
            success:true,
            data:result
        });


    }
    async getGroupUsers(req:Request,res:Response):Promise<Response>{
      const trainerId = req.user?.userId;

        const dto = new GetTrainerUsersRequestDTO({
          trainerId:trainerId!,
         page: Number(req.query.page) || 1,
        limit: Number(req.query.limit) || 10,
        search: req.query.search as string          
        });
        const result = await this._getGroupUsersUseCase.execute(dto);
      return  res.status(HttpStatus.OK).json({
            success:true,
            data:result
        });
    }
       async getTrainerUpcomingSlots(req: Request, res: Response): Promise<Response> {
        const trainerId = req.user?.userId;
        const dto = new GetTrainerUpcomingSlotRequestDTO({
            trainerId: trainerId!,
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 10
        });
        const result = await this._getTrainerUpcomingUseCase.execute(dto);
        return res.status(HttpStatus.OK).json({
            success: true,
            data: result
        });

    }

}