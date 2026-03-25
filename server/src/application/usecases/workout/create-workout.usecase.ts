import { CreateWorkoutRequestDTO } from "@/application/dto/workout/request/create-workout.dto";
import { CreateWorkoutFiles } from "@/application/dto/workout/request/create-workoutFile.dto";
import { CreateWorkoutResponseDTO } from "@/application/dto/workout/response/create-workout.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import {  WORKOUT_MESSAGES } from "@/domain/constants/messages.constants";
import { WorkoutEntity } from "@/domain/entities/workout/workout.entity";
import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";



export class CreateWorkoutUseCase implements IBaseUseCase<CreateWorkoutRequestDTO,CreateWorkoutResponseDTO,CreateWorkoutFiles>{
    constructor(
        private readonly _workoutRepository:IWorkoutRepository,
        private readonly _storageProvider:IStorageProvider
    ){}
    async execute(dto: CreateWorkoutRequestDTO, files: CreateWorkoutFiles ): Promise<CreateWorkoutResponseDTO> {
        if(!files?.thumbnail ||!files?.video){
            throw new Error(WORKOUT_MESSAGES.FILES_MUST_REQUIRED);
        }
        const videoUrl = await this._storageProvider.uploadWorkoutVideo(
            files.video.buffer,
            files.video.originalname,
            files.video.mimetype
        );
        const thumbnailUrl = await this._storageProvider.uploadImage(
            files.thumbnail.buffer,
            files.thumbnail.originalname,
            files.thumbnail.mimetype
        );
        const workout = WorkoutEntity.create({
            ...dto,
            videoUrl,
            thumbnailUrl
        });

        const saved = await this._workoutRepository.create(workout);
        return new CreateWorkoutResponseDTO({
      id:saved.id!,
      title: saved.title,
      description: saved.description,
      specializationId: saved.specializationId,
      duration: saved.duration,
      caloriesBurn: saved.caloriesBurn,
      bodyFocus: saved.bodyFocus,
      difficulty: saved.difficulty,
      videoUrl: saved.videoUrl,
      thumbnailUrl: saved.thumbnailUrl,
      status: saved.status,
      createdAt: saved.createdAt,       
     });
    };
}