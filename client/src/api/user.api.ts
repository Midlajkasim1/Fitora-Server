import { AI_ROUTES, BOOKING_ROUTES, HEALTH_ROUTES, USER_ROUTES } from "../constants/api.constants";
import type { AiPlanResponse, DietDay, EditProfile, GeneratePlanRequest, HealthMetricsData, IChangePassword, PremiumDashboardData, UpcomingSessionResponse, UserProfileResponse, WorkoutDay } from "../type/user.types"
import api from "./axios"



export const userProfile = async():Promise<UserProfileResponse>=>{
    const res = await api.get<UserProfileResponse>(USER_ROUTES.PROFILE);
    return res.data;
}
    
export const editProfile = (data:EditProfile)=>{
    return  api.put(USER_ROUTES.PROFILE,data);
}

export const uploadProfileImage = (formdata:FormData)=>{
    return api.put(USER_ROUTES.PROFILE_IMAGE,formdata)
}

export const ChangePassword =(data:IChangePassword)=>{
    return api.put(USER_ROUTES.CHANGE_PASSWORD,data)
}

export const getActiveAdvertisement = async ()=>{
    const res = await api.get(USER_ROUTES.ADVERTISEMENT);
    return res.data.data;
}

export const getPremiumDashboard = async (): Promise<PremiumDashboardData> => {
  const res = await api.get(USER_ROUTES.DASHBOARD);
  return res.data.data;
};
export const saveHealthMetrics = async (data: HealthMetricsData) => {
  const response = await api.post(HEALTH_ROUTES.BASE, data);
  return response.data;
};
export const checkHealthMetrics = async () => {
  const res = await api.get(HEALTH_ROUTES.CHECK);
  return res.data.data;
};
export const updateWeeklyWeight = async (weight: number) => {
  const response = await api.patch(HEALTH_ROUTES.WEEKLY_UPDATE, { weight });
  return response.data;
};

export const fetchUpcomingSessions = async (page = 1, limit = 10): Promise<UpcomingSessionResponse> => {
  const res = await api.get(BOOKING_ROUTES.UPCOMING_SESSIONS, {
    params: { page, limit }
  });
  return res.data.data;
};

export const getBookingTrainers = async (page: number, limit: number, search?: string) => {
  const res = await api.get(BOOKING_ROUTES.BOOKING_TRAINERS, { 
    params: { page, limit, search } 
  });
  return res?.data?.data; 
};
export const getAvailableSlots = async (page: number, limit: number, search?: string,trainerId?:string) => {
  const res = await api.get(BOOKING_ROUTES.SLOTS,{
    params: { page, limit, search,trainerId }
  });
  return res?.data?.data; 
};

export const bookSlot = async (slotId: string) => {
  const res = await api.post(BOOKING_ROUTES.BOOK_SLOT(slotId));
  return res?.data;
};

export const cancelBooking = async (slotId: string) => {
  const res = await api.post(BOOKING_ROUTES.CANCEL_BOOKING(slotId));
  return res?.data;
};

export const generateAiWorkout = async (data: GeneratePlanRequest): Promise<AiPlanResponse<WorkoutDay>> => {
  const res = await api.post<AiPlanResponse<WorkoutDay>>(AI_ROUTES.GENERATE_WORKOUT, data);
  return res.data; 
};

export const generateAiDiet = async (data: GeneratePlanRequest): Promise<AiPlanResponse<DietDay>> => {
  const res = await api.post<AiPlanResponse<DietDay>>(AI_ROUTES.GENERATE_DIET, data);
  return res.data;
};
export const fetchAiWorkout = async (): Promise<AiPlanResponse<WorkoutDay>> => {
  const res = await api.get<AiPlanResponse<WorkoutDay>>(AI_ROUTES.FETCH_WORKOUT_PLAN);
  return res.data;
};

export const fetchAiDiet = async (): Promise<AiPlanResponse<DietDay>> => {
  const res = await api.get<AiPlanResponse<DietDay>>(AI_ROUTES.FETCH_DIET_PLAN);
  return res.data;
};