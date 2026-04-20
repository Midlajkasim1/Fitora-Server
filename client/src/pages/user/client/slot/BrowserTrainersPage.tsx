import { useState } from "react";
import { Search, Star, ArrowRight, Dumbbell, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../../../hooks/admin/use-debounce";
import { GlobalLoader } from "../../../../shared/GlobalLoader";
import { Pagination } from "../../../../components/admin/Pagination";
import { useBookingTrainers } from "../../../../hooks/user/slot/use-bookingTrainer";
import { useChatStore } from "../../../../store/use-chat-store";
import { useChatPartners } from "../../../../hooks/user/slot/use-chatPartners";

const BrowseTrainers = () => {
  const navigate = useNavigate();
  const { openChat } = useChatStore();
  const { data: partnersData } = useChatPartners();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const LIMIT = 8;

  const { data, isLoading } = useBookingTrainers(page, LIMIT, debouncedSearch);

  if (isLoading && !data) return <GlobalLoader />;

  return (
    <div className="min-h-screen bg-[#0d1f17] p-8">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-white tracking-tighter">Choose Your Coach</h1>
          <p className="text-gray-500 text-xs font-bold uppercase italic tracking-widest">Expert trainers matched to your goals</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full bg-[#132a1e] border border-white/5 rounded-2xl py-4 pl-12 text-white text-xs font-bold  italic outline-none focus:border-[#00ff94]"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data?.trainers.map((trainer: { trainerId: string; profileImage?: string; rating: number; name: string; bio: string; availableSlotsCount: number }) => {
            const isChatEnabled = partnersData?.partners.some(p => p.id === trainer.trainerId);
            
            return (
              <div key={trainer.trainerId} className="bg-[#132a1e] border border-white/5 rounded-[2.5rem] p-6 group hover:border-[#00ff94]/30 transition-all flex flex-col justify-between">
                <div>
                  <div className="relative mb-6">
                    <div className="w-20 h-20 bg-black/40 rounded-3xl flex items-center justify-center overflow-hidden border border-white/5">
                      {trainer.profileImage ? (
                        <img src={trainer.profileImage} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Dumbbell className="text-gray-700" size={32} />
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-[#00ff94] text-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                      <Star size={10} fill="black" />
                      <span className="text-[10px] font-black italic">{trainer.rating}</span>
                    </div>
                  </div>

                  <h3 className="text-white font-black uppercase italic text-lg mb-1">{trainer.name}</h3>
                  <p className="text-gray-500 text-[10px] font-bold uppercase italic mb-4 line-clamp-2">{trainer.bio}</p>
                  
                  {/* Slot Count Badge */}
                  <div className="mb-6 flex items-center gap-2">
                    <div className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase italic tracking-wider flex items-center gap-2 ${
                      trainer.availableSlotsCount > 0 
                      ? "bg-[#00ff94]/10 text-[#00ff94] border border-[#00ff94]/20" 
                      : "bg-red-500/10 text-red-500 border border-red-500/20"
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${trainer.availableSlotsCount > 0 ? "bg-[#00ff94] animate-pulse" : "bg-red-500"}`} />
                      {trainer.availableSlotsCount} Slots Available
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/check-slots?trainerId=${trainer.trainerId}`)}
                    className="flex-1 py-4 bg-white/5 border border-white/5 group-hover:bg-white/10 text-gray-400 group-hover:text-white rounded-2xl font-black uppercase italic text-[10px] transition-all flex items-center justify-center gap-2"
                  >
                    Availability <ArrowRight size={14} />
                  </button>
                  {isChatEnabled && (
                    <button 
                      onClick={() => openChat(trainer.trainerId)}
                      className="px-4 bg-[#00ff94]/10 text-[#00ff94] border border-[#00ff94]/20 hover:bg-[#00ff94] hover:text-black rounded-2xl transition-all"
                    >
                      <MessageCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>


        <Pagination 
          currentPage={page} 
          totalPages={Math.ceil((data?.total || 0) / LIMIT)} 
          totalResults={data?.total || 0} 
          resultsPerPage={LIMIT} 
          onPageChange={setPage} 
        />
      </main>
    </div>
  );
};

export default BrowseTrainers;