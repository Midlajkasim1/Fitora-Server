import { ADMIN_ROUTES } from "../constants/api.constants";
import type { AdminLoginPayload, AdvertisementQuery, WorkoutQuery } from "../type/admin.types";
import api from "./axios";

export const adminLogin = (data: AdminLoginPayload) => {
  return api.post(ADMIN_ROUTES.LOGIN, data);
};
export const getAdminMe = () => {
  return api.get(ADMIN_ROUTES.ME);
  
};
export const adminLogout = () => {
  return api.post(ADMIN_ROUTES.LOGOUT); 
};
export const toggleUserBlock = (userId: string) => {
  return api.patch(ADMIN_ROUTES.BLOCK_USER(userId));
}

export const toggleTrainerBlock = (userId:string)=>{
  return api.patch(ADMIN_ROUTES.BLOCK_TRAINER(userId))
}

export const toggleSpecializationBlock =(specializationId:string)=>{
  return api.patch(ADMIN_ROUTES.BLOCK_SPECIALIZATION(specializationId))
}

export const getAllWorkouts = (params:WorkoutQuery)=>{
  return api.get(ADMIN_ROUTES.WORKOUTS,{
    params:{
      page:params.page,
      search:params.search,
      status:params.status,
      difficulty:params.difficulty
    }
  })
};

export const toggleWorkoutStatus = (workoutId:string)=>{
  return api.patch(ADMIN_ROUTES.TOGGLE_WORKOUT(workoutId))
}

export const getAllAdvertisements = (params: AdvertisementQuery) => {
  return api.get(ADMIN_ROUTES.ADVERTISEMENTS, {
    params: {
      page: params.page,
      search: params.search,
      status: params.status,
    },
  });
}
 export const AdvertisementToggleStatus = (adId:string)=>{
    return api.patch(ADMIN_ROUTES.TOGGLE_AD(adId))
  }

export const createAdvertisement = (formData:FormData)=>{
  return api.post(ADMIN_ROUTES.CREATE_AD,formData,{
    headers:{
      "Content-Type":"multipart/form-data"
    },
  })
}
export const getAdvertisementById = async (id: string) => {
  const response = await api.get(ADMIN_ROUTES.GET_AD_BY_ID(id));
  return response.data.data;
};
export const updateAdvertisement = async (id: string, formData: FormData) => {
  const response = await api.put(ADMIN_ROUTES.UPDATE_AD(id), formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}