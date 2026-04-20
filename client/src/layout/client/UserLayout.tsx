import { Outlet } from "react-router-dom";
import { UserHeader } from "./ClientHeader";
import { UserFooter } from "./ClientFooter";
import { PageMeta } from "../../shared/PageMeta";
import { ChatPanel } from "../../components/user/ChatPanel";
import { useChatStore } from "../../store/use-chat-store";

 const UserLayout = () => {
   const { isOpen, closeChat, selectedTrainerId } = useChatStore();

  return (
    <div className="bg-[#07140f] min-h-screen flex flex-col">
      <PageMeta
        title="Fitora | Your Fitness Journey" 
        favicon="/favicon.svg" 
      />
      <UserHeader />

      <main className="flex-1 pt-28 px-6 md:px-12">
        <Outlet />
      </main>

      <UserFooter />

      {/* Chat Panel Overlay */}
      <ChatPanel 
        isOpen={isOpen} 
        onClose={closeChat} 
        initialTrainerId={selectedTrainerId || undefined} 
      />

    </div>
  );
};
export default UserLayout