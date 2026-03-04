import { IWorkoutRepository } from "@/domain/interfaces/repositories/workout.repository";
import { WorkoutMapper } from "../mappers/workout.mapper";
import { WorkoutEntity } from "@/domain/entities/workout/workout.entity";
import { WorkoutModel } from "../models/workout.model";
import { WorkoutStatus } from "@/domain/constants/workout.constant";
import { GetWorkoutSelectionRequestDTO } from "@/application/dto/user/request/get-workoutSelection.dto";



export class WorkoutRepository implements IWorkoutRepository {
    constructor(
        private readonly workoutMapper: WorkoutMapper
    ) { }
    async create(workout: WorkoutEntity): Promise<WorkoutEntity> {
        const data = this.workoutMapper.toMongo(workout);
        const doc = await WorkoutModel.create(data);
        const result = await WorkoutModel.findById(doc._id).lean();
        if (!result) {
            throw new Error("Workout creation falied");

        }
        return this.workoutMapper.toEntity(result);
    }
    async findById(id: string): Promise<WorkoutEntity | null> {
        const doc = await WorkoutModel.findById(id).lean();
        if (!doc) return null;
        return this.workoutMapper.toEntity(doc);
    }
    async findAll(params: { page: number; limit: number; search?: string; status?: string; }): Promise<{ workouts: WorkoutEntity[]; total: number; }> {
        const { page, limit, search, status } = params;

        const filter: Record<string, unknown> = {};
        if (search) {
            filter.title = { $regex: search, $options: "i" };
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
            workouts: docs.map(doc => this.workoutMapper.toEntity(doc)),
            total
        };
    }
    async update(id: string, updateData: Record<string, unknown>): Promise<void | null> {
        await WorkoutModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).lean();
    }
    async findByTitle(title: string): Promise<WorkoutEntity | null> {
        const doc = await WorkoutModel.findOne({ title }).lean();
        if (!doc) return null;

        return this.workoutMapper.toEntity(doc);
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
        return docs.map(doc=>this.workoutMapper.toEntity(doc));
    }
async findOneByWorkoutSelection(dto: GetWorkoutSelectionRequestDTO): Promise<WorkoutEntity | null> {
    const doc = await WorkoutModel.findOne({
        specializationId:dto.id,
        difficulty:dto.difficulty,
        duration:dto.duration,
        status:WorkoutStatus.ACTIVE

    }).lean();
    if(!doc)return null;
    return this.workoutMapper.toEntity(doc);
}
    
}