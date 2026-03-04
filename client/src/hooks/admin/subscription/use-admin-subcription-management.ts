import { useQuery } from "@tanstack/react-query";
import type { GetSubscriptionsResponse, SubscriptionQuery } from "../../../type/admin.types";
import api from "../../../api/axios";



export const useSubcriptionManagement=(params:SubscriptionQuery)=>{
    return useQuery<GetSubscriptionsResponse>({
        queryKey:["admin-subscriptions",params],
        queryFn:async()=>{
            const res = await api.get("/admin/subscriptions",{
                params:{
                    page:params.page,
                    limit:10,
                    search:params.search,
                    status:params.status
                    
                }
            });
            return res.data.data;
    },
    placeholderData:(prev)=>prev
}
)
}