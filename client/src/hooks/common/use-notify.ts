import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead } from "../../api/notification.api";

export const useNotificationsLogic = () => {
  const queryClient = useQueryClient();

const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await getNotifications();
      return res.data.data;
    },
    // ✅ Add this to ensure it updates as soon as it's invalidated
    staleTime: 0, 
    refetchOnWindowFocus: true,
  });

  // 2. Mark as Read Mutation
  const markReadMutation = useMutation({
    mutationFn: (id: string) => markAsRead(id),
    onSuccess: () => {
      // Invalidate the cache to refresh the list and count
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return {
    notifications,
    isLoading,
    unreadCount,
    markRead: markReadMutation.mutate,
  };
};