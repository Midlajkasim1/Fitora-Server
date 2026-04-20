import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, User, ChevronLeft } from "lucide-react";
import { useChatPartners } from "../../hooks/user/slot/use-chatPartners";
import { useChatHistory } from "../../hooks/user/slot/use-chatHistory";
import { useAuthStore } from "../../store/use-auth-store";

export const ChatPanel = ({ 
  isOpen, 
  onClose, 
  initialTrainerId 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  initialTrainerId?: string;
}) => {
  const { user } = useAuthStore();
  const role = user?.role === 'trainer' ? 'trainer' : 'user';
  const { data: partnersData } = useChatPartners();
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(initialTrainerId || null);
  const [message, setMessage] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { 
    data: historyData, 
    sendMessage, 
    isSending,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useChatHistory(selectedTrainerId);

  // Sync initial trainer id
  useEffect(() => {
    if (initialTrainerId) setSelectedTrainerId(initialTrainerId);
  }, [initialTrainerId]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [historyData]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedTrainerId) return;
    sendMessage({ message: message.trim() });
    setMessage("");
  };

  const selectedTrainer = partnersData?.partners.find(p => p.id === selectedTrainerId);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Panel */}
      <div className="relative w-full max-w-md bg-[#0a1810] border-l border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-4">
            {selectedTrainerId && (
              <button 
                onClick={() => setSelectedTrainerId(null)}
                className="p-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <h2 className="text-xl font-black italic uppercase text-white tracking-tighter">
                {selectedTrainer ? selectedTrainer.name : "Messages"}
              </h2>
              <p className="text-[9px] text-[#00ff94] font-bold uppercase italic tracking-widest mt-0.5">
                {selectedTrainerId ? "Active Conversation" : `Choose a ${role === 'trainer' ? 'client' : 'trainer'} to chat`}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {!selectedTrainerId ? (
            /* Partners List */
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {partnersData?.partners.map((partner) => (
                <button
                  key={partner.id}
                  onClick={() => setSelectedTrainerId(partner.id)}
                  className="w-full p-4 rounded-3xl bg-white/5 border border-transparent hover:border-[#00ff94]/20 hover:bg-[#00ff94]/5 transition-all flex items-center gap-4 group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-black/40 flex items-center justify-center overflow-hidden border border-white/5 relative">
                    {partner.profileImage ? (
                      <img src={partner.profileImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={20} className="text-gray-600" />
                    )}
                    {partner.hasUnread && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#00ff94] rounded-full shadow-[0_0_10px_#00ff94] border-2 border-[#0a1810]" />
                    )}
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="text-sm font-black italic uppercase text-white group-hover:text-[#00ff94] transition-colors">
                      {partner.name}
                    </h4>
                    <p className="text-[9px] text-gray-500 font-bold uppercase italic mt-1">Available for chat</p>
                  </div>
                  <MessageCircle size={16} className={partner.hasUnread ? "text-[#00ff94]" : "text-gray-700 group-hover:text-[#00ff94]"} />
                </button>
              ))}
              {partnersData?.partners.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-20 pointer-events-none">
                  <MessageCircle size={64} className="mb-4" />
                  <p className="text-xs font-black uppercase italic tracking-tighter text-center px-12">
                    No active sessions found. You can chat once you book a trainer!
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Message Area */
            <>
              <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col-reverse"
              >
                {/* Intersection observer / Load More could go here */}
                {historyData?.pages.flat().map((page) => 
                  page.messages.map((msg) => {
                    const isOwn = msg.senderId === user?.id;
                    return (
                      <div 
                        key={msg.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`max-w-[80%] p-4 rounded-3xl text-xs font-bold italic ${
                          isOwn 
                            ? "bg-[#00ff94] text-black rounded-tr-sm shadow-[0_4px_20px_rgba(0,255,148,0.2)]" 
                            : "bg-white/5 text-gray-200 border border-white/5 rounded-tl-sm"
                        }`}>
                          {msg.message}
                          <div className={`text-[8px] mt-2 font-black uppercase opacity-40 ${isOwn ? "text-right" : "text-left"}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {hasNextPage && (
                  <button 
                    onClick={() => fetchNextPage()} 
                    disabled={isFetchingNextPage}
                    className="text-[9px] font-black uppercase italic text-gray-500 hover:text-white py-2"
                  >
                    {isFetchingNextPage ? "Loading..." : "Load older messages"}
                  </button>
                )}
              </div>

              {/* Input Area */}
              <div className="p-6 bg-black/20 border-t border-white/5">
                <form onSubmit={handleSend} className="relative">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-[#132a1e] border border-white/5 rounded-2xl py-4 pl-6 pr-14 text-white text-xs font-bold italic outline-none focus:border-[#00ff94] transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !message.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#00ff94] text-black rounded-xl flex items-center justify-center hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
