import { useQuery } from "@tanstack/react-query"
import type { TrainerVerificationById } from "../../type/admin.types"
import api from "../../api/axios"


export const useTrainerVerificationById = (id:string) =>{
    return useQuery<TrainerVerificationById>({
        queryKey:["trainer-verification",id],
        queryFn:async () =>{
            const res = await api.get(`/admin/trainer/verifications/${id}`);
            return res.data.data
        },
        enabled:!!id
    })
}