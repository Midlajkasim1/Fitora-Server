import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import toast from "react-hot-toast";
import { getTrainerProfile, updateTrainerProfile, uploadTrainerAvatar } from "../../../api/trainer.api";

export const useTrainerProfile = () => {
  const queryClient = useQueryClient();

  const { data: trainer, isLoading } = useQuery({
    queryKey: ["trainer-profile"],
    queryFn: getTrainerProfile,
  });

  const updateMutation = useMutation({
    mutationFn: updateTrainerProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-profile"] });
      toast.success("Profile updated!");
    },
  });

  const uploadMutation = useMutation({
    mutationFn: uploadTrainerAvatar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trainer-profile"] });
      toast.success("Image uploaded!");
    },
  });

  return { trainer, isLoading, updateProfile: updateMutation.mutate, uploadAvatar: uploadMutation.mutate, isUpdating: updateMutation.isPending };
};