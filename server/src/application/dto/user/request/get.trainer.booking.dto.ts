

export class GetTrainersBookingRequestDTO {
    userId!: string;
    page!: number;
    limit!: number;
    search?: string;
    constructor(data: GetTrainersBookingRequestDTO) {
        Object.assign(this, data);
    }
}