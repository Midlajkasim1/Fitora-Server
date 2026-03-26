import { CreateSlotRequestDTO } from "@/application/dto/slot/request/create-slot.dto";
import { CreateSlotResponseDTO } from "@/application/dto/slot/response/create-slot.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { AUTH_MESSAGES } from "@/domain/constants/messages.constants";
import { createSlotSchema } from "@/infrastructure/validators/user/trainer-slot.validator";
import { Request, Response } from "express";


export class TrainerSlotController {
    constructor(
        private readonly  _createSlotUseCase:IBaseUseCase<CreateSlotRequestDTO,CreateSlotResponseDTO>
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
}