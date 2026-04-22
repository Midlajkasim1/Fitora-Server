import { useQuery } from "@tanstack/react-query";
import api from "../../../api/axios";

export const useSessionAccess = (slotId: string) => {
    return useQuery({
        queryKey: ["session-access", slotId],
        queryFn: async () => {
            const response = await api.get(`/sessions/${slotId}/access`);
            return response.data.data as { canJoin: boolean; showReview: boolean; bookingId: string };

        },
        enabled: !!slotId,
        retry: false,
        staleTime: 0,
        gcTime: 0
    });
};

