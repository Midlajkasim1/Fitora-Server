import { WorkoutEntity } from "@/domain/entities/workout/workout.entity";
import { IMapper } from "@/domain/interfaces/services/mapper.interface";
import { IWorkoutDocument } from "../interfaces/workout-document.interface";
import { Types } from "mongoose";
import { WorkoutDifficulty } from "@/domain/constants/workout.constant";



export class WorkoutMapper implements IMapper<WorkoutEntity, IWorkoutDocument> {
    toEntity(doc: IWorkoutDocument): WorkoutEntity {
        return WorkoutEntity.create({
            id: doc._id.toString(),
            title: doc.title,
            description: doc.description,
            specializationId: doc.specializationId.toString(),
            difficulty: doc.difficulty as WorkoutDifficulty,
            duration: doc.duration,
            caloriesBurn: doc.caloriesBurn,
            bodyFocus: doc.bodyFocus,
            videoUrl: doc.videoUrl,
            thumbnailUrl: doc.thumbnailUrl,
            status: doc.status,
        });
    }
    toMongo(entity: WorkoutEntity): Partial<IWorkoutDocument> {
        return {
            title: entity.title,
            description: entity.description,
            specializationId: new Types.ObjectId(entity.specializationId),
            difficulty: entity.difficulty,
            duration: entity.duration,
            caloriesBurn: entity.caloriesBurn,
            bodyFocus: entity.bodyFocus,
            videoUrl: entity.videoUrl,
            thumbnailUrl: entity.thumbnailUrl ?? "",
            status: entity.status,
        };
    }
}