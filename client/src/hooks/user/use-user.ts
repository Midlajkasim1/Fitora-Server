import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ChangePassword, editProfile, uploadProfileImage, userProfile } from "../../api/user.api"
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";



export const useUser =()=>{
    const {data,isLoading,refetch} = useQuery({
        queryKey:["user-profile"],
        queryFn:userProfile
    });

    return {
        user:data?.data,
        isLoading,
        refetch
    }
}

export const useUpdateUser =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:editProfile,
        onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["user-profile"]});
      toast.success("profile updated")
        }
    })
}
export const useUploadProfileImage =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:uploadProfileImage,
        onSuccess:()=>{
            queryClient.invalidateQueries({queryKey:["user-profile"]});
            toast.success("profile image uploaded")
        }
    })
}

export const useChangePassword =()=>{
    const navigate = useNavigate();

    return useMutation({
        mutationFn:ChangePassword,
        onSuccess:()=>{
       toast.success("password changed successfully")
        navigate("/profile", { replace: true });

        }
    })
}