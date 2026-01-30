export interface UserOnboardingDTO {
    userId: string;
    dob: Date;
    gender: string;
    primary_motives: string[];
    experience_level: string;
    water_intake: number;
    diet_preference: string;
    preferred_workouts: string[];
    sleep_hours: number;
    medical_conditions: string[];
}