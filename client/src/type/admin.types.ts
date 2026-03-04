export type AdminStatus = "active" | "blocked";

export interface Admin {
  id: string;
  email: string;
  status: AdminStatus;
  role: "admin"; 
}

export interface AdminLoginPayload{
  email: string;
  password: string;
}

export type UserBlockPayload={
  userId:string;
}


export interface UserQuery{
  page:number;
  search:string;
  status:string;
}

export interface UserManagement{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  status: "active" | "blocked";
  createdAt: Date;
}
export interface UserManagementResponse {
  users:UserManagement[];
  total:number;
}


export interface TrainerQuery{
  page:number;
  search:string;
  status:string;
  specialization:string
}

export interface TrainerManagement{
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
  status: "active" | "blocked";
  createdAt: Date;
}

export interface GetTrainersResponse{
  trainers: TrainerManagement[];
  total:number
}

export interface SpQuery {
  page:number;
  search:string;
  status:string
}

export interface getSpecializations {
  id:string;
  name:string;
  description:string;
  imageUrl:string;
  status:string;
  

}
export interface getAllSpecializationResponse {
  specialization:getSpecializations[];
  total:number;
}

export interface CreateSpecialization {
  name:string;
  description?:string;
  image?:File;
}
export interface UpdateSpecialization{
  id: string;
  name: string;
  description?: string;
  image?: File;
}

export interface TvQuery {
  page:number;
  search?:string;
  status?:string;
}

export interface UpdateApprovalStatus{
    id: string;
      status: "approved" | "rejected" | "pending";
      reason?: string;
}

export interface TrainerVerificationById {
  id: string;
  userId: string;
  trainerName: string;
  email: string;
  profileImage: string | null;
  experienceYear: number;
  approvalStatus: "pending" | "approved" | "rejected";
  createdAt: string;
  bio: string;
  certifications: string[];
  specializations: {
    id: string;
    name: string;
  }[];
  rejectionReason?: string | null;
}
export interface TrainerVerificationList {
  id: string;
  userId: string;
  trainerName: string;
  email: string;
  experienceYear: number;
  approvalStatus: string;
  createdAt: Date;
}


export interface WorkoutQuery {
  page: number;
  search?: string;
  status?: string;
}

export interface WorkoutManagement {
  id: string;
  title: string;
  specializationName: string;
  duration: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  status: "active" | "blocked";
  thumbnailUrl: string;
}

export interface GetAllWorkoutResponse {
  workouts: WorkoutManagement[];
  total: number;
}

export interface SubscriptionManagement {
  id: string;
  name: string;
  price: string | number;
  billingCycle: string;
  description?: string;
  status: "active" | "inactive";
  totalPurchaseUser: number;
  createdAt: string | Date;
}

export interface GetSubscriptionsResponse {
  subscriptions: SubscriptionManagement[];
  totals: number;
}

export interface SubscriptionQuery {
  page: number;
  search?: string;
  status?: string;
}


export interface CreateSubscriptionRequest {
  name: string;
  price: string | number;
  billingCycle: string;
  description: string;
}

