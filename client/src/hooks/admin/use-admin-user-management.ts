import { useQuery } from "@tanstack/react-query";
import type {  UserManagementResponse, UserQuery } from "../../type/admin.types";
import api from "../../api/axios";



export const useUserManagement = (params:UserQuery)=>{
    return useQuery<UserManagementResponse>({
        queryKey:["admin-users",params],
        queryFn:async ()=>{
            const res = await api.get("/admin/users",{
                params:{
                    page:params.page,
                    limit:10,
                    search:params.search,
                    status:params.status
                }
            })
            return res.data.data
        },
        placeholderData: (prev) => prev
    });
}