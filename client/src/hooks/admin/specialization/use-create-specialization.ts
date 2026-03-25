import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import type { CreateSpecialization } from "../../../type/admin.types";



export const useCreateSpecialization = ()=>{
    const queryClient = useQueryClient();

    return useMutation({
     mutationFn:async (data:CreateSpecialization)=>{
        const formData = new FormData();
        formData.append("name",data.name);
        if(data.description)formData.append("description",data.description);
        if(data.image)formData.append("image",data.image);
        const res = await api.post("/admin/create-specializations",formData,{
            headers:{
             "Content-Type": "multipart/form-data",
            }
        })
        return res?.data
     },
     onSuccess:()=>{
    
        queryClient.invalidateQueries({
            queryKey:["admin-specializations"]
        })

     }
    })
}