import { useQuery } from "@tanstack/react-query"
import api from "../../../api/axios"

export const useUserSpecializations =()=>{
    return useQuery({
        queryKey:["user-specialization"],
        queryFn:async()=>{
            const res = await api.get("/user/specializations");
            return res.data.data
        }
    })
}