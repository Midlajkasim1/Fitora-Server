import type { UserRole } from "./auth.types";

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender?: string;
  status: "active" | "blocked";
  role?:UserRole;
  preferredWorkouts: string;
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
  preferredWorkouts?: string;
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
    trainerId: string;
    startTime: string;
    trainerName: string;
    type: string;
  } | null;
  sessionsPerDay: { day: string; value: number }[];
  totalSessionsAttended: number;
  totalSubscriptionSessions: number;
  sessionsLeft: number;
}


export interface UserUpcomingSlot {
  slotId: string;
  trainerId: string;
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


// types/ai-plan.ts
export interface Exercise {
  name: string;
  sets: number;
  reps: string | number;
  restTime: string;
  notes?: string;
  _id?: string;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: Exercise[];
  warmup?: string;
  cooldown?: string;
}

export interface Meal {
  name: string;
  time: string;
  foods: string[];
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  _id?: string;
}

export interface DietDay {
  day: string;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  waterIntake: number;
}

export interface AiPlanResponse<T> {
  success: boolean;
  message: string;
  planId: string;
  title: string;
  weeklyPlan: T[];
}

export interface GeneratePlanRequest {
  metrics?: {
    goal?: string;
    level?: string;
    equipment?: string[];
    days?: number;
    
  };
}

export interface ChatPartner {
  id: string;
  name: string;
  profileImage?: string;
  /** True when the user has an active booking OR the session ended <24 h ago */
  isChatEnabled: boolean;
  hasUnread: boolean;
}

export interface ChatPartnersResponse {
  partners: ChatPartner[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  total: number;
  page: number;
  totalPages: number;
}