import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AdvertisementToggleStatus } from "../../../api/admin.api";
import type { GetAllAdsResponse } from "../../../type/admin.types";


export const useAdvertisementToggleStatus =()=>{
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn:(adId:string)=>AdvertisementToggleStatus(adId),
        onSuccess:(_,advertisementId)=>{
            queryClient.setQueriesData<GetAllAdsResponse>(
                {queryKey:["admin-advertisements"]},
                (oldData)=>{
                    if(!oldData)return oldData;
                    return {
                        ...oldData,
                        Advertisement:oldData.Advertisement.map((ad)=>
                         ad.id === advertisementId  ? {...ad,status:ad.status === "active" ? "blocked":"active"}:ad
                        )
                    }
                }
            );
        },
    })
}