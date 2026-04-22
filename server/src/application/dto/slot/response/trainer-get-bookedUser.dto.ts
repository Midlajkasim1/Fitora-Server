
export interface BookedUserListDTO {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
    totalBookedSlots: number;
    lastSessionTime: Date;
}

export interface GetTrainerStudentResponseDTO {
    users: BookedUserListDTO[]
    total: number;
}