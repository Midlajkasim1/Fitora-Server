import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";
import { WorkoutMapper } from "../mappers/workout.mapper";
import { WorkoutEntity } from "@/domain/entities/workout/workout.entity";
import { WorkoutModel } from "../models/workout.model";
import { WorkoutDifficulty, WorkoutStatus } from "@/domain/constants/workout.constant";
import { GetWorkoutSelectionRequestDTO } from "@/application/dto/user/request/get-workoutSelection.dto";
import { WORKOUT_MESSAGES } from "@/domain/constants/messages.constants";
import { BaseRepository } from "./base.repository";
import { IWorkoutDocument } from "../interfaces/workout-document.interface";
import { Model } from "mongoose";



export class WorkoutRepository extends BaseRepository<WorkoutEntity,IWorkoutDocument> implements IWorkoutRepository {
    constructor(
        private readonly _workoutMapper: WorkoutMapper
    ) { 
        super(WorkoutModel as unknown as Model<IWorkoutDocument>,_workoutMapper);
    }
    async create(workout: WorkoutEntity): Promise<WorkoutEntity> {
        const data = this._workoutMapper.toMongo(workout);
        const doc = await WorkoutModel.create(data);
        const result = await WorkoutModel.findById(doc._id).lean();
        if (!result) {
            throw new Error(WORKOUT_MESSAGES.WORKOUT_CREATION_FAILED);

        }
        return this._workoutMapper.toEntity(result);
    }
    async findById(id: string): Promise<WorkoutEntity | null> {
        const doc = await WorkoutModel.findById(id).lean();
        if (!doc) return null;
        return this._workoutMapper.toEntity(doc);
    }
    async findAllWorkout(params: { page: number; limit: number; search?: string; status?: WorkoutStatus;difficulty?:WorkoutDifficulty;duration?:number }): Promise<{ data: WorkoutEntity[]; total: number; }> {
        const { page, limit, search, status,difficulty,duration } = params;

        const filter: Record<string, unknown> = {};
        if (search) {
            filter.title = { $regex: search, $options: "i" };
        }
        if(difficulty){
            filter.difficulty = difficulty;
        }
        if(duration){
            filter.duration=duration;
        }
        if (status) {
            filter.status = status;
        }
        const skip = (page - 1) * limit;
        const [docs, total] = await Promise.all([
            WorkoutModel.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            WorkoutModel.countDocuments(filter),

        ]);
        return {
            data: docs.map(doc => this._workoutMapper.toEntity(doc)),
            total
        };
    }
    async update(id: string, updateData: Partial<WorkoutEntity>): Promise<WorkoutEntity | null> {
        const doc = await WorkoutModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true }
        ).lean();
        return doc ? this._workoutMapper.toEntity(doc) : null;
    }
    async findByTitle(title: string): Promise<WorkoutEntity | null> {
        const doc = await WorkoutModel.findOne({ title }).lean();
        if (!doc) return null;

        return this._workoutMapper.toEntity(doc);
    }
    async updateStatus(id: string,status:WorkoutStatus): Promise<void> {
        await WorkoutModel.findByIdAndUpdate(id,{status});
    }
    async findBySpecializationId(specializationId: string): Promise<WorkoutEntity[]> {
        const docs = await WorkoutModel.find({
            specializationId,
            status:"active"
        }).sort({createdAt:-1})
        .lean();
        return docs.map(doc=>this._workoutMapper.toEntity(doc));
    }
async findOneByWorkoutSelection(dto: GetWorkoutSelectionRequestDTO): Promise<WorkoutEntity | null> {
    const doc = await WorkoutModel.findOne({
        specializationId:dto.id,
        difficulty:dto.difficulty,
        duration:dto.duration,
        status:WorkoutStatus.ACTIVE

    }).lean();
    if(!doc)return null;
    return this._workoutMapper.toEntity(doc);
}
    
}