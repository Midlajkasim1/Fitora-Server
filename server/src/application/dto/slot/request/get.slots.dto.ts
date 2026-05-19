import { SessionType } from "@/domain/constants/session.constants";

export class GetAvailableSlotsRequestDTO {
    userId!: string;
    trainerId?:string;
    page!: number;
    limit!: number;
    search?: string;
    type?:SessionType;
    constructor(data: GetAvailableSlotsRequestDTO) {
        Object.assign(this, data);
    }

}