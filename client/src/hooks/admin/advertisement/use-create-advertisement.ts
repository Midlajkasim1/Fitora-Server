import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom";
import { createAdvertisement } from "../../../api/admin.api";
import toast from "react-hot-toast";


export const useCreateAdvertisement=()=>{
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    return useMutation({
        mutationFn:(formData:FormData)=>createAdvertisement(formData),
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["admin-advertisements"]});
            toast.success("Advertisement created successfully");
            navigate("/admin/advertisements")
        }
    })
}