

export interface GetUserProfileResponse {
    id:string;
    firstName:string;
    lastName:string;
    phone?:string;
    profileImage?:string;
    gender?:string;
    preferredWorkouts?:string[];
    experienceLevel?:string;
    status?:string;
}