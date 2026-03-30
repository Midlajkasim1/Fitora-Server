// pages/user/UpcomingSessions.tsx
import { useState } from "react";
import { CalendarDays, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useUpcomingSessions } from "../../../../hooks/user/slot/use-upcomingSession";
import { useCancelBooking } from "../../../../hooks/user/slot/use-cancelBooking";
import { GlobalLoader } from "../../../../shared/GlobalLoader";
import { UserSessionCard } from "../../../../components/user/UserSessionCard";
import { Pagination } from "../../../../components/admin/Pagination";
import { ConfirmModal } from "../../../../shared/ConfirmModal";


const UpcomingSessions = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  
  const LIMIT = 6;
  // Data Fetching
  const { data, isLoading } = useUpcomingSessions(currentPage, LIMIT);
  
  // Cancellation Mutation
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;

  // Handlers
  const handleCancelIntent = (slotId: string) => {
    setSelectedSlotId(slotId);
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedSlotId) {
      cancelBooking(selectedSlotId, {
        onSuccess: () => {
          setIsCancelModalOpen(false);
          setSelectedSlotId(null);
        },
      });
    }
  };

  if (isLoading) return <GlobalLoader />;

  return (
    <div className="min-h-screen bg-[#0d1f17] p-8 space-y-8">
      {/* Header Section */}
      <header className="max-w-5xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link to="/premium-dashboard" className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#00ff94] transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
              My Sessions
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic mt-1">
              Manage your upcoming training appointments
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[#00ff94] bg-[#00ff94]/5 border border-[#00ff94]/10 px-6 py-3 rounded-2xl">
          <CalendarDays size={18} />
          <span className="text-[10px] font-black uppercase italic tracking-wider">
            {data?.total || 0} Total Bookings
          </span>
        </div>
      </header>

      {/* Sessions List Container */}
      <main className="max-w-5xl mx-auto space-y-4">
        {data?.sessions && data.sessions.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-4">
              {data.sessions.map((session) => (
                <UserSessionCard
                  key={session.slotId}
                  session={session}
                  onCancel={handleCancelIntent}
                />
              ))}
            </div>

            {/* Pagination Component */}
            <div className="pt-6 border-t border-white/5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={data.total}
                resultsPerPage={LIMIT}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-6">
               <CalendarDays size={32} />
            </div>
            <p className="text-gray-500 text-xs font-black uppercase italic tracking-widest">
              You don't have any sessions booked yet.
            </p>
            <Link to="/check-slots" className="mt-6 bg-[#00ff94] text-black px-8 py-4 rounded-2xl font-black uppercase italic text-[11px] shadow-[0_0_20px_rgba(0,255,148,0.2)]">
              Browse Available Slots
            </Link>
          </div>
        )}
      </main>

      {/* Modals */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => !isCancelling && setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Booking?"
        message="Are you sure you want to cancel this session? You can only cancel at least 24 hours before the start time."
        confirmText={isCancelling ? "Cancelling..." : "Yes, Cancel"}
      />
    </div>
  );
};

export default UpcomingSessions;