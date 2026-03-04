import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../../api/axios";
import type { GetSubscriptionsResponse } from "../../../type/admin.types";

export const useSubscriptionToggle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.patch(`/admin/subscriptions/${id}/status`);
      return res.data;
    },
    onSuccess: (_,subId) => {
        queryClient.setQueriesData<GetSubscriptionsResponse>(
            {queryKey:["admin-subscriptions"]},
            (oldData=>{
                if(!oldData)return oldData;
                return {
                    ...oldData,
                    subscriptions:oldData.subscriptions.map((sub)=>
                        sub.id === subId?{...sub,status:sub.status === "active" ? "inactive":"active"}:sub
                    )
                }
            })
        )
    },
  });
};