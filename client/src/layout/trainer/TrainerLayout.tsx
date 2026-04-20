import { Outlet } from "react-router-dom";
import { PageMeta } from "../../shared/PageMeta";
import Sidebar from "./SideBar";
import { TrainerHeader } from "./TrainerHeader"; 
import { ChatPanel } from "../../components/user/ChatPanel";
import { useChatStore } from "../../store/use-chat-store";

const TrainerLayout = () => {
  const { isOpen, closeChat, selectedTrainerId } = useChatStore();

  return (
    <div className="flex bg-[#06110d] min-h-screen font-sans">
      <PageMeta 
        title="Trainer Dashboard | Fitora" 
        favicon="/favicon.svg" 
      />
      
      <Sidebar />

      <div className="flex-1 ml-64 flex flex-col h-screen">
        
        <TrainerHeader />

        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="max-w-[1400px] mx-auto p-8">
             <Outlet />
          </div>
        </main>
      </div>

      {/* Unified Chat Overlay for Trainers */}
      <ChatPanel 
        isOpen={isOpen} 
        onClose={closeChat} 
        initialTrainerId={selectedTrainerId || undefined} 
      />
    </div>
  );
};

export default TrainerLayout;