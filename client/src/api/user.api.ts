import type { AiPlanResponse, DietDay, EditProfile, GeneratePlanRequest, HealthMetricsData, IChangePassword, PremiumDashboardData, UpcomingSessionResponse, UserProfileResponse, WorkoutDay } from "../type/user.types"
import api from "./axios"



export const userProfile = async():Promise<UserProfileResponse>=>{
    const res = await api.get<UserProfileResponse>("/user/profile");
    return res.data;
}
    
export const editProfile = (data:EditProfile)=>{
    return  api.put("/user/profile",data);
}

export const uploadProfileImage = (formdata:FormData)=>{
    return api.put("/user/profileImage",formdata)
}

export const ChangePassword =(data:IChangePassword)=>{
    return api.put("/user/change-password",data)
}

export const getActiveAdvertisement = async ()=>{
    const res = await api.get("/user/advertisement");
    return res.data.data;
}

export const getPremiumDashboard = async (): Promise<PremiumDashboardData> => {
  const res = await api.get("user/premium-dashboard");
  return res.data.data;
};
export const saveHealthMetrics = async (data: HealthMetricsData) => {
  const response = await api.post("/user/health-metrics", data);
  return response.data;
};
export const checkHealthMetrics = async () => {
  const res = await api.get("user/health-metrics/check");
  return res.data.data;
};
export const updateWeeklyWeight = async (weight: number) => {
  const response = await api.patch("/user/health-metrics/weekly-update", { weight });
  return response.data;
};

export const fetchUpcomingSessions = async (page = 1, limit = 10): Promise<UpcomingSessionResponse> => {
  const  res  = await api.get(`user/upcoming-session?page=${page}&limit=${limit}`);
  return res.data.data;
};

export const getBookingTrainers = async (page: number, limit: number, search?: string) => {
  const res = await api.get("user/booking/trainers", { params: { page, limit, search } });
  return res?.data?.data; 
};
export const getAvailableSlots = async (page: number, limit: number, search?: string,trainerId?:string) => {
  const res = await api.get("user/slots",{
    params: { page, limit, search,trainerId }
  });
  return res?.data?.data; 
};

export const bookSlot = async (slotId: string) => {
  const res= await api.post(`user/slots/${slotId}/book`);
  return res?.data;
}

export const cancelBooking = async (slotId: string) => {
  const res = await api.post(`user/slots/${slotId}/cancel`);
  return res?.data;
};

export const generateAiWorkout = async (data: GeneratePlanRequest): Promise<AiPlanResponse<WorkoutDay>> => {
  const res = await api.post<AiPlanResponse<WorkoutDay>>("user/generate-workout", data);
  return res.data; // This now returns the full object with success, message, and weeklyPlan
};

export const generateAiDiet = async (data: GeneratePlanRequest): Promise<AiPlanResponse<DietDay>> => {
  const res = await api.post<AiPlanResponse<DietDay>>("user/generate-diet", data);
  return res.data;
};
export const fetchAiWorkout = async (): Promise<AiPlanResponse<WorkoutDay>> => {
  const res = await api.get<AiPlanResponse<WorkoutDay>>("user/workout-plan");
  return res.data;
};

export const fetchAiDiet = async (): Promise<AiPlanResponse<DietDay>> => {
  const res = await api.get<AiPlanResponse<DietDay>>("user/diet-plan");
  return res.data;
};