export class CheckHealthMetricsResponseDTO {
    exists!: boolean;
    metrics?: {
        height: number;
        weight: number;
        targetWeight: number;
        primaryGoal: string;
    };

    constructor(data: CheckHealthMetricsResponseDTO) {
        Object.assign(this, data);
    }
}