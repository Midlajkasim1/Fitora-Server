
export interface BookedUserListDTO{
     slotId: string;
    startTime: Date;
    status: string;
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    profileImage?: string;
}

export interface GetTrainerStudentResponseDTO {
  users:BookedUserListDTO[]
  total: number;
  
}