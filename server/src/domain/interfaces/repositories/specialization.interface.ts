import { SpecializationEntity } from "@/domain/entities/specialization/specialization.entity";
import { IBaseRepository } from "./base.repository";
import { SpecializationStatus } from "@/domain/constants/auth.constants";


export interface ISpecialization extends IBaseRepository<SpecializationEntity> {
    findByName(name: string): Promise<SpecializationEntity | null>;
    updateStatus(id: string, status: SpecializationStatus): Promise<void>;
    findByIds(ids: string[]): Promise<SpecializationEntity[]>
    findAllSP(params: {
        page: number;
        limit: number;
        search?: string;
        status?: SpecializationStatus;
    }): Promise<{ data: SpecializationEntity[]; total: number; }>
}