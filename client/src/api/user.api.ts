import type { EditProfile, IChangePassword, PremiumDashboardData, UpcomingSessionResponse, UserProfileResponse } from "../type/user.types"
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
