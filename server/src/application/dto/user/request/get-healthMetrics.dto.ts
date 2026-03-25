export class CheckHealthMetricsRequestDTO {
    userId!: string;

    constructor(data: CheckHealthMetricsRequestDTO) {
    Object.assign(this, data);
    }
}