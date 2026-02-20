import type { AdminLoginPayload } from "../type/admin.types";
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

export const AllUserCount = ()=>{
  return api.get("/admin/get-allUsers");
}