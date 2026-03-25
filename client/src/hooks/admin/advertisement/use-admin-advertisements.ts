import { useQuery } from "@tanstack/react-query";
import type { AdvertisementQuery, GetAllAdsResponse } from "../../../type/admin.types";
import { getAllAdvertisements } from "../../../api/admin.api";


export const useAdvertisementManagement=(params:AdvertisementQuery)=>{
    return useQuery<GetAllAdsResponse>({
        queryKey:["admin-advertisements",params],
        queryFn:async()=>{
        const res = await getAllAdvertisements(params)
        return res.data?.data;
        },
        placeholderData:(prev)=>prev
    })
}