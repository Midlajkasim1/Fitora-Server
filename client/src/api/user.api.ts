import type { EditProfile, IChangePassword, UserProfileResponse } from "../type/user.types"
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