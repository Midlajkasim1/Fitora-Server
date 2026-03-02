import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleUserBlock } from "../../api/admin.api";
import type { UserManagementResponse } from "../../type/admin.types";

export const useToggleUserBlock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => toggleUserBlock(userId),

    onSuccess: (_, userId) => {
      queryClient.setQueriesData<UserManagementResponse>(
        { queryKey: ["admin-users"] },
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            users: oldData.users.map((user) =>
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