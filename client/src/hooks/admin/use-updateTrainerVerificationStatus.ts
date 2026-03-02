

import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../api/axios";
import toast from "react-hot-toast";
import type { UpdateApprovalStatus } from "../../type/admin.types";

export const useUpdateTrainerApproval = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data:UpdateApprovalStatus) => {
      return api.patch(`/admin/trainer/verifications/${data.id}`, {
        status: data.status,
        reason: data.reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["trainer-verification"],
      });
      toast.success("Status updated");
    },
  });
};