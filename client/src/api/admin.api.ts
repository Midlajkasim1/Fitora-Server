import type { AdminLoginPayload, AdvertisementQuery, WorkoutQuery } from "../type/admin.types";
import api from "./axios";

export const adminLogin = (data: AdminLoginPayload) => {
  return api.post("/admin/login", data);
};
export const getAdminMe = () => {
  
  return api.get('/admin/me');
  
};
export const adminLogout = () => {
  return api.post("/admin/logout"); 
};
export const toggleUserBlock = (userId: string) => {
  return api.patch(`/admin/users/${userId}/block`);
}

export const toggleTrainerBlock = (userId:string)=>{
  return api.patch(`/admin/trainers/${userId}/block`)
}

export const toggleSpecializationBlock =(specializationId:string)=>{
  return api.patch(`/admin/specializations/${specializationId}/block`)
}

export const getAllWorkouts = (params:WorkoutQuery)=>{
  return api.get("/admin/workouts",{
    params:{
      page:params.page,
      search:params.search,
      status:params.status,
      difficulty:params.difficulty
    }
  })
};

export const toggleWorkoutStatus = (workoutId:string)=>{
  return api.patch(`/admin/workouts/${workoutId}/status`)
}

//advertisement
export const getAllAdvertisements = (params: AdvertisementQuery) => {
  return api.get("/admin/advertisement", {
    params: {
      page: params.page,
      search: params.search,
      status: params.status,
    },
  });
}
 export const AdvertisementToggleStatus = (adId:string)=>{
    return api.patch(`/admin/advertisement/${adId}/status`)
  }

export const createAdvertisement = (formData:FormData)=>{
  return api.post("/admin/create-ad",formData,{
    headers:{
      "Content-Type":"multipart/form-data"
    },
  })
}
export const getAdvertisementById = async (id: string) => {
  const response = await api.get(`/admin/advertisement/${id}`);
  return response.data.data;
};
export const updateAdvertisement = async (id: string, formData: FormData) => {
  const response = await api.put(`/admin/update-ad/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}