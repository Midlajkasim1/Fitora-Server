// hooks/trainer/profile/use-trainer-profile.ts

import { useMutation, } from "@tanstack/react-query";
import { changeTrainerPassword } from "../../../api/trainer.api";
import type { ChangePasswordPayload } from "../../../type/trainer.types";
import toast from "react-hot-toast";

export const useTrainerChangePassword = () => {
  
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changeTrainerPassword(payload),
    onSuccess: () => {
      toast.success("Password updated successfully!");
    },
  
  });
}; 