import { useQuery } from "@tanstack/react-query";
import type { TvQuery } from "../../type/admin.types";
import api from "../../api/axios";



export const useTrainerVerificationManagement = (params:TvQuery) =>{
    return useQuery({
        queryKey:["trainer-verification",params],
        queryFn:async ()=>{
            const res = await api.get("/admin/trainer/verifications",{
                params:{
                    page:params.page,
                    limit:10,
                    search:params.search,
                    status:params.status
                }
            });
            return res?.data.data
        },
        placeholderData:(prev)=>prev,
    })
}