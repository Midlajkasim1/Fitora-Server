import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserHeader } from "./ClientHeader";
import { UserFooter } from "./ClientFooter";
import { PageMeta } from "../../shared/PageMeta";
import { ChatPanel } from "../../components/user/ChatPanel";
import { useChatStore } from "../../store/use-chat-store";

 const UserLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isOpen, closeChat, selectedTrainerId } = useChatStore();

    const handleCloseChat = () => {
      const params = new URLSearchParams(location.search);
      const shouldGoBack = params.get('back') === 'dashboard';
      
      closeChat();
      
      if (shouldGoBack) {
        navigate("/home", { replace: true });
      }
    };

  return (
    <div className="bg-[#07140f] min-h-screen flex flex-col">
      <PageMeta
        title="Fitora | Your Fitness Journey" 
        favicon="/favicon.svg" 
      />
      <UserHeader />

      <main className="flex-1 pt-28">
        <Outlet />
      </main>

      <UserFooter />

      {/* Chat Panel Overlay */}
      <ChatPanel 
        isOpen={isOpen} 
        onClose={handleCloseChat} 
        initialTrainerId={selectedTrainerId || undefined} 
      />

    </div>
  );
};
export default UserLayout