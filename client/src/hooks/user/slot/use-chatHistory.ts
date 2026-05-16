import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchChatHistory, markMessagesRead, sendMessage } from "../../../api/user.api";
import { useEffect } from "react";
import { useSocket } from "../../common/use-notification";
import { useAuthStore } from "../../../store/use-auth-store";

export const useChatHistory = (otherUserId: string | null) => {
  const queryClient = useQueryClient();
  const socket = useSocket();
  const { user } = useAuthStore();
  const role = user?.role === 'trainer' ? 'trainer' : 'user';

  // ─── Fetch History with Infinite Scroll ───────────────────────────────────
  const historyQuery = useInfiniteQuery({
    queryKey: ["chat-history", otherUserId, role],
    queryFn: ({ pageParam = 1 }) => fetchChatHistory(otherUserId!, role, pageParam),
    enabled: !!otherUserId,
    getNextPageParam: (lastPage) => (lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
  });

  // ─── Mark Read Logic ─────────────────────────────────────────────────────
  const markReadMutation = useMutation({
    mutationFn: () => markMessagesRead(otherUserId!, role),
    onSuccess: () => {
      // Invalidate partners to clear the "active dots"
      queryClient.invalidateQueries({ queryKey: ["chat-partners", role] });
    },
  });

  useEffect(() => {
    if (otherUserId) {
      markReadMutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [otherUserId]);

  // ─── Real-time Listener ────────────────────────────────────────────────────
  useEffect(() => {
    if (!socket || !otherUserId) return;

    const handleMessage = (data: { data?: { senderId?: string; receiverId?: string } }) => {
      const msg = data.data;
      // Only care about messages from/to the current selected user
      if (msg?.senderId === otherUserId || msg?.receiverId === otherUserId) {
        queryClient.invalidateQueries({ queryKey: ["chat-history", otherUserId, role] });
        
        // If we are currently chatting with this user, mark as read immediately
        if (msg?.senderId === otherUserId) {
          markReadMutation.mutate();
        }
      } else {
        // If it's a message from someone else, invalidate partners to show the dot
        queryClient.invalidateQueries({ queryKey: ["chat-partners", role] });
      }
    };

    socket.on("receive_message", handleMessage);
    return () => {
      socket.off("receive_message", handleMessage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, otherUserId, queryClient, role]);

  // ─── Send Mutation ─────────────────────────────────────────────────────────
  const sendMutation = useMutation({
    mutationFn: ({ message, attachmentUrl, attachmentType }: { message: string, attachmentUrl?: string, attachmentType?: string }) => 
      sendMessage(otherUserId!, role, message, attachmentUrl, attachmentType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat-history", otherUserId, role] });
    },
  });

  return {
    ...historyQuery,
    sendMessage: sendMutation.mutate,
    isSending: sendMutation.isPending,
  };
};
