import { useQuery } from "@tanstack/react-query";
import { getChatPartners } from "../../../api/user.api";
import type { ChatPartner } from "../../../type/user.types";
import { useAuthStore } from "../../../store/use-auth-store";

export const useChatPartners = () => {
  const { user } = useAuthStore();
  const role = user?.role === 'trainer' ? 'trainer' : 'user';

  return useQuery<{ partners: ChatPartner[] }>({
    queryKey: ["chat-partners", role],
    queryFn: () => getChatPartners(role),
    // Re-fetch every 5 minutes so the grace period state stays fresh
    staleTime: 5 * 60 * 1000,
  });
};
