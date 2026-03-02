import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleTrainerBlock } from "../../api/admin.api";
import type { GetTrainersResponse } from "../../type/admin.types";

export const useToggleTrainerBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => toggleTrainerBlock(userId),

    onSuccess: (_, userId) => {
      queryClient.setQueriesData<GetTrainersResponse>(
        { queryKey: ["admin-trainer"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            trainers: oldData.trainers.map((user) =>
              user.id === userId
                ? {
                    ...user,
                    status:
                      user.status === "blocked"
                        ? "active"
                        : "blocked"
                  }
                : user
            )
          };
        }
      );
    }
  });
};