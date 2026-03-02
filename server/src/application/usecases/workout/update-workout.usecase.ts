import { UpdateWorkoutRequestDTO } from "@/application/dto/workout/request/update-workout.dto";
import { UpdateWorkoutFiles } from "@/application/dto/workout/request/update-workoutFiles.dto";
import { UpdatedWorkoutResponseDTO } from "@/application/dto/workout/response/update-workout.dto";
import { IBaseUseCase } from "@/application/interfaces/base-usecase.interface";
import { WORKOUT_MESSAGES } from "@/domain/constants/messages.constants";
import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";
import { IStorageProvider } from "@/domain/interfaces/services/storage-provider.interface";




export class UpdateWorkoutUseCase implements IBaseUseCase<UpdateWorkoutRequestDTO,UpdatedWorkoutResponseDTO,UpdateWorkoutFiles>{
       constructor(
        private readonly _workoutRepository:IWorkoutRepository,
        private readonly _storageProvider:IStorageProvider
       ){}

async execute(dto: UpdateWorkoutRequestDTO,files?:UpdateWorkoutFiles): Promise<UpdatedWorkoutResponseDTO> {
    const workout = await this._workoutRepository.findById(dto.id);
    if(!workout){
        throw new Error(WORKOUT_MESSAGES.WORKOUT_NOT_FOUND);
    }
    if(dto.title && dto.title !== workout.title){
        const sameWorkout = await this._workoutRepository.findByTitle(dto.title);
        if(sameWorkout && sameWorkout.id !==dto.id){
            throw new Error(WORKOUT_MESSAGES.WORKOUT_ALREADY_EXIST);
        }
    }
      const { id, ...rest } = dto;
    const updateData :  Record<string,unknown> = {...rest};

      if(files?.video){
         await this._storageProvider.deleteFile(workout.videoUrl);
         const newvideoUrl = await this._storageProvider.uploadWorkoutVideo(
          files.video.buffer,
          files.video.originalname,
          files.video.mimetype

        );
        updateData.videoUrl = newvideoUrl;
      }
      if(files?.thumbnail){
        if(workout?.thumbnailUrl){
            await this._storageProvider.deleteFile(workout.thumbnailUrl);

        }
        const newthumbnail = await this._storageProvider.uploadImage(
          files.thumbnail.buffer,
          files.thumbnail.originalname,
          files.thumbnail.mimetype
        );
        updateData.thumbnailUrl = newthumbnail;
      }
      await this._workoutRepository.update(id,updateData);

    return {
      message:WORKOUT_MESSAGES.WORKOUT_UPDATED,
    };
}


}