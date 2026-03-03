import { GetSpecializationRequest } from "@/application/dto/specialization/request/get-specialization.dto";
import { GetSpecializationByIdRequestDTO } from "@/application/dto/specialization/request/get-specializationById.dto";
import { GetSpecializationResponseDTO } from "@/application/dto/specialization/response/get-specialization.dto";
import { GetSpecializationByIdResponseDTO } from "@/application/dto/specialization/response/get-specializationById.dto";
import { GetWorkoutBySpecializationRequestDTO } from "@/application/dto/user/request/get-workoutBy-Specialization.dto";
import { GetWorkoutSelectionRequestDTO } from "@/application/dto/user/request/get-workoutselection.dto";
import { GetWorkoutsBySpecializationResponseDTO } from "@/application/dto/user/response/get-workoutBy-specialization.dto";
import { GetWorkoutSelectionResponseDTO } from "@/application/dto/user/response/get-workoutSelection.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { SpecializationStatus } from "@/domain/constants/auth.constants";
import { HttpStatus } from "@/domain/constants/http-status.constants";
import { Request, Response } from "express";


export class UserSpecializationController {
  constructor(
    private readonly _getAllSpecializationUseCase: IBaseUseCase<GetSpecializationRequest, GetSpecializationResponseDTO>,
    private readonly _getSpecializationByIdUseCase:IBaseUseCase<GetSpecializationByIdRequestDTO,GetSpecializationByIdResponseDTO>,
    private readonly _getWorkoutBySpecializationUseCase:IBaseUseCase<GetWorkoutBySpecializationRequestDTO,GetWorkoutsBySpecializationResponseDTO>,
    private readonly _getWorkoutSelectionUseCase: IBaseUseCase<GetWorkoutSelectionRequestDTO,GetWorkoutSelectionResponseDTO>
  ) {}

  async getActiveSpecializations(req: Request, res: Response):Promise<Response> {
    const dto = {
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string,
      status: SpecializationStatus.ACTIVE,
    };

    const result = await this._getAllSpecializationUseCase.execute(dto);

    return res.json({
      success: true,
      data: result,
    });
  }
  async getSpecializationDetails(req:Request,res:Response):Promise<Response>{
     const id = req.params.id;
      const specializations =await this._getSpecializationByIdUseCase.execute({id});
      const workouts = await this._getWorkoutBySpecializationUseCase.execute({id});
      return res.status(HttpStatus.OK).json({
        success:true,
        data:{
            specializations,
            workouts
        }
    
      });
  }
  async getStartSession(req:Request,res:Response):Promise<Response>{
    const dto:GetWorkoutSelectionRequestDTO={
        id:req.params.id,
        difficulty:req.query.difficulty as string,
        duration:Number(req.query.duration)
    };
    const result = await this._getWorkoutSelectionUseCase.execute(dto);
    return res.status(HttpStatus.OK).json({
        success:true,
        data:result
    });
  }
}