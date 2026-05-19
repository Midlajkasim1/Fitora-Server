// application/dto/trainer/response/get-trainers-booking.dto.ts

export interface TrainerBookingDTO {
    trainerId: string;
    name: string;
    profileImage?: string;
    specializations: string; 
    experience: number;      
    rating: number;            
    bio: string;            
    availableSlotsCount: number;
}

export interface GetTrainersBookingResponseDTO {
    trainers: TrainerBookingDTO[];
    total: number;
}