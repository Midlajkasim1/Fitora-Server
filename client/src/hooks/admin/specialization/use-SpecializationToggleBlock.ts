import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSpecializationBlock } from "../../../api/admin.api";
import type { getAllSpecializationResponse } from "../../../type/admin.types";



export const useSpecializationToggleBlock =()=>{
    const queryClient = useQueryClient();
    return useMutation({
     mutationFn : (specializationId:string)=>toggleSpecializationBlock(specializationId),
     onSuccess:(_,specializationId)=>{
        queryClient.setQueriesData<getAllSpecializationResponse>(
          {queryKey:["admin-specializations"]}  ,
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            specialization: oldData.specialization.map((sp) =>
              sp.id === specializationId
                ? {
                    ...sp,
                    status:
                      sp.status === "blocked"
                        ? "active"
                        : "blocked"
                  }
                : sp
            )
          };
        }
    )
     }
    })
}