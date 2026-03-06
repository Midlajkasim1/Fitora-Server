import { model } from "mongoose";
import { HealthMetricsSchema } from "../schemas/user/client-health-metrics.schema";



export const HealthMetricsModel = model("client_health_metrics",HealthMetricsSchema);