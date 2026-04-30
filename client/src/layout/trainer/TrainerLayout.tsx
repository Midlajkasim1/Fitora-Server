import { useState } from "react";
import { Outlet } from "react-router-dom";
import { PageMeta } from "../../shared/PageMeta";
import Sidebar from "./SideBar";
import { TrainerHeader } from "./TrainerHeader"; 
import { ChatPanel } from "../../components/user/ChatPanel";
import { useChatStore } from "../../store/use-chat-store";

const TrainerLayout = () => {
  const { isOpen, closeChat, selectedTrainerId } = useChatStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#06110d] min-h-screen font-sans relative overflow-x-hidden">
      <PageMeta 
        title="Trainer Dashboard | Fitora" 
        favicon="/favicon.svg" 
      />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="flex-1 flex flex-col h-screen lg:ml-64">
        
        <TrainerHeader onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="max-w-[1400px] mx-auto p-4 md:p-8">
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