export interface ClientDetailsResponseDTO {
  basicInfo: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    profileImage: string | null;
    gender?: string;
    age?: number;
  };
  healthMetrics: {
    weight: number;
    height: number;
    targetWeight: number;
    goal: string;
  } | null;
  sessionHistory: Array<{
    slotId: string;
    startTime: Date;
    endTime: Date;
    type: string;
    status: string;
  }>;
}
