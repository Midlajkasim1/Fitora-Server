// pages/trainer/UpcomingSessions.tsx
import { useState } from "react";
import { Plus, CalendarDays } from "lucide-react";

import { Pagination } from "../../../components/admin/Pagination";
import { useTrainerUpcomingSlots } from "../../../hooks/trainer/use-upcomingSession";
import { UpcomingSessionCard } from "../../../components/trainer/UpcomingSessionCard";
import { CreateSlotModal } from "../../../components/trainer/SlotModal";

const UpcomingSessions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const LIMIT = 10;
  
  const { data, isLoading } = useTrainerUpcomingSlots({
    page: currentPage,
    limit: LIMIT
  });
  console.log(data)

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;

  return (
    <div className="p-8 space-y-8 bg-[#06110d] min-h-screen">
      {/* Header with Create Button */}
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white uppercase tracking-tighter italic">Schedule</h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic mt-1">Manage your future training slots</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#00ff94] text-black font-black text-[11px] rounded-xl hover:bg-[#00e685] transition uppercase italic shadow-[0_0_20px_rgba(0,255,148,0.3)]"
        >
          <Plus size={18} /> Create Session Slot
        </button>
      </header>

      {/* Stats Summary */}
      <div className="flex items-center gap-4 text-[#00ff94] bg-[#00ff94]/5 border border-[#00ff94]/10 p-4 rounded-2xl">
        <CalendarDays size={20} />
        <span className="text-xs font-black uppercase tracking-widest italic">
          You have {data?.total || 0} sessions scheduled for the coming weeks
        </span>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {isLoading ? (
          [...Array(5)].map((_, i) => (
            <div key={i} className="h-20 bg-[#1a2c26]/50 animate-pulse rounded-2xl border border-white/5" />
          ))
        ) : (
          <>
            {data?.slots.map((slot) => (
              <UpcomingSessionCard key={slot.slotId} slot={slot} />
            ))}

            {data?.slots.length === 0 && (
              <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-3xl">
                <p className="text-gray-600 text-xs font-black uppercase italic">No upcoming sessions found.</p>
              </div>
            )}
          </>
        )}
      </div>
  

      {/* Pagination */}
      {data && data.total > 0 && (
        <div className="pt-6 border-t border-white/5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={data.total}
            resultsPerPage={LIMIT}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
          <CreateSlotModal
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default UpcomingSessions;