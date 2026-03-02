import type { AdminLoginPayload, WorkoutQuery } from "../type/admin.types";
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
      status:params.status
    }
  })
};

export const toggleWorkoutStatus = (workoutId:string)=>{
  return api.patch(`/admin/workouts/${workoutId}/status`)
}