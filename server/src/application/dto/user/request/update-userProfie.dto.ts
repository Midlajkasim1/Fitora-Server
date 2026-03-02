import { ExperienceLevel } from "@/domain/constants/auth.constants";


export interface  UpdateUserProfileRequest{
    id:string;
    firstName?:string;
    lastName?:string;
    phone?:string;
    preferredWorkouts?:string[];
    experienceLevel?:ExperienceLevel;
    
}