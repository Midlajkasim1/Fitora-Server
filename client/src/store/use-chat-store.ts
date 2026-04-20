import { create } from 'zustand';

interface ChatStore {
  isOpen: boolean;
  selectedTrainerId: string | null;
  hasUnread: boolean;
  openChat: (trainerId?: string) => void;
  closeChat: () => void;
  toggleChat: () => void;
  setHasUnread: (val: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  isOpen: false,
  selectedTrainerId: null,
  hasUnread: false,
  openChat: (trainerId) => set({ isOpen: true, selectedTrainerId: trainerId || null, hasUnread: false }),
  closeChat: () => set({ isOpen: false }),
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen, hasUnread: state.isOpen ? state.hasUnread : false })),
  setHasUnread: (val) => set({ hasUnread: val }),
}));
