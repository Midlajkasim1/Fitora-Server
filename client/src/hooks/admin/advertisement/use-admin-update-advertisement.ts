import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateAdvertisement } from "../../../api/admin.api";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import type { UpdateParams } from "../../../type/admin.types";



export const useUpdateAdvertisement = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: ({ id, data }: UpdateParams) => updateAdvertisement(id, data),
    
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-advertisement", variables.id] });
      
      queryClient.invalidateQueries({ queryKey: ["admin-advertisements"] });
      
      toast.success("Advertisement updated successfully!");
      navigate("/admin/advertisements");
    },
    
 
  });
};