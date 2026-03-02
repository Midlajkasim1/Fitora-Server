import { SpecializationStatus } from "@/domain/constants/auth.constants";


export  interface GetSpecializationRequest {
    page:number;
    limit:number;
    search?:string;
    status?:SpecializationStatus;
}