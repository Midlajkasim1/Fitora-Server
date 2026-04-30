import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";
import { VIDEO_ROUTES } from "../../../constants/api.constants";

export const useSessionAccess = (slotId: string) => {
    return useQuery({
        queryKey: ["session-access", slotId],
        queryFn: async () => {
            const response = await api.get(VIDEO_ROUTES.GET_ACCESS_STATE(slotId));
            return response.data.data as { canJoin: boolean; showReview: boolean; bookingId: string };

        },
        enabled: !!slotId,
        retry: false,
        staleTime: 0,
        gcTime: 0
    });
};

