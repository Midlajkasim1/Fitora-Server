import type { UserRole } from "./auth.types";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender?: string;
  status: "active" | "blocked";
  role?:UserRole;
  preferredWorkouts: string[];
  experienceLevel: string;
  profileImage?: string | null;
 
}

export interface UserProfileResponse {
  success: boolean;
  data: UserProfile;
}
export interface EditProfile {
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredWorkouts?: string[];
  experienceLevel?: string;
}

export interface IChangePassword {
  currentPassword:string;
  newPassword:string
}

export interface Specialization {
  id:string;
  name:string;
  description:string;
  imageUrl:string;
}
export interface SpResponse {
  items:Specialization[];
  total:number;
}

export interface StartWorkout{
  id: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
}

export interface PurchaseHistoryItem {
  paymentId: string;
  planName: string;
  amount: number;
  status: string;           
  subscriptionStatus: string; 
  date: string;
  paymentMethod: string;
}

export interface PurchaseHistoryResponse {
  history: PurchaseHistoryItem[];
  total: number;
}

export interface PremiumDashboardData {
  welcomeName: string;
  showWeightModal:boolean
  metrics: {
    weight: number;
    height: number;
    age: number;
    bodyFat: number;
    primaryGoal:string;
  };
  bmi: {
    value: number;
    status: string;
  };
  weightLoss: {
    current: number;
    target: number;
    progressPercentage: number;
  };
  monthlyProgress: { day: string; value: number }[];
  nextSession: {
    slotId: string;
    startTime: string;
    trainerName: string;
    type: string;
  } | null;
}

export interface UserUpcomingSlot {
  slotId: string;
  startTime: string;
  endTime: string;
  type: 'one_on_one' | 'group';
  status: string;
  trainerName: string;
  trainerProfile?: string;
}

export interface UpcomingSessionResponse {
  sessions: UserUpcomingSlot[];
  total: number;
}

export type SessionType = 'one_on_one' | 'group';

export interface AvailableSlotResponse{
  id: string;             
  trainerId: string;      
  trainerName: string;     
  startTime: string;      
  endTime: string;        
  type: SessionType;      
  capacity: number;     
  availableSeats: number;  
  status: string;  
  isBookedByUser:boolean       
}
export interface HealthMetricsData {
  height: number;
  weight: number;
  targetWeight: number;
  primaryGoal: string;
}