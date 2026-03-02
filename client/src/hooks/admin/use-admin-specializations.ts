import { useQuery } from "@tanstack/react-query";
import type { getAllSpecializationResponse, SpQuery } from "../../type/admin.types";
import api from "../../api/axios";


export const useSpecializationManagement = (params:SpQuery)=>{
    return useQuery<getAllSpecializationResponse>({
     queryKey:["admin-specializations",params],
     queryFn:async ()=>{
     const res = await api.get("/admin/specializations",{
        params:{
            page:params.page,
            search:params.search,
            status:params.status
        }
     });
     return res.data?.data;
     },
     placeholderData:(prev)=>prev
    })
}