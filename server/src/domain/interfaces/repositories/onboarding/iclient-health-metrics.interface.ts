import { HealthMetricsEntity } from "@/domain/entities/user/client-health-metrics.entity";
import { IBaseRepository } from "../base.repository";


export interface IHealthMetricsRepository extends IBaseRepository<HealthMetricsEntity>{
    save(metrics:HealthMetricsEntity):Promise<void>;
    findByUserId(userId:string):Promise<HealthMetricsEntity | null>
}