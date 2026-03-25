import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";


export const  useSpecializationsForFilter=()=>{
    return useQuery({
        queryKey:["admin-specializations"],
        queryFn:async ()=>{
            const res = await api.get("/admin/specializations");
            return res.data.data.specialization
        }
    })
}


 