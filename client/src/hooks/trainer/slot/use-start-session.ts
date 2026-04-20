import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { VIDEO_ROUTES } from "../../../constants/api.constants";
import toast from "react-hot-toast";

export const useStartSession = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: async (slotId: string) => {
            const response = await api.post(VIDEO_ROUTES.START_SESSION(slotId));
            return { slotId, data: response.data };
        },
        onSuccess: ({ slotId }) => {
            toast.success("Session started! Redirecting to call...");
            queryClient.invalidateQueries({ queryKey: ["trainerUpcomingSlots"] });
            navigate(`/video-call/${slotId}`);
        },
        onError: (error: any) => {
            const message = error.response?.data?.message || "Failed to start session";
            toast.error(message);
        }
    });
};
