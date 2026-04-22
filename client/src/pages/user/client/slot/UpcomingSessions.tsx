import { useState, useEffect } from "react";
import { CalendarDays, ArrowLeft, Plus, Users } from "lucide-react"; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useUpcomingSessions } from "../../../../hooks/user/slot/use-upcomingSession";
import { useCancelBooking } from "../../../../hooks/user/slot/use-cancelBooking";
import { GlobalLoader } from "../../../../shared/GlobalLoader";
import { UserSessionCard } from "../../../../components/user/UserSessionCard";
import { Pagination } from "../../../../components/admin/Pagination";
import { ConfirmModal } from "../../../../shared/ConfirmModal";
import { useChatStore } from "../../../../store/use-chat-store";

const UpcomingSessions = () => {
  const location = useLocation();
  const { openChat } = useChatStore();
  const [currentPage, setCurrentPage] = useState(1);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [canCancel, setCanCancel] = useState(true);
  const LIMIT = 6;
  const navigate = useNavigate();
  const { data, isLoading } = useUpcomingSessions(currentPage, LIMIT);

  // Cancellation Mutation
  const { mutate: cancelBooking, isPending: isCancelling } = useCancelBooking();

  // Handle auto-opening chat from dashboard
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const trainerId = params.get('chat');
    if (trainerId) {
      openChat(trainerId);
      // We keep the 'back' param to allow UserLayout to handle the return navigation
    }
  }, [location.search, openChat]);

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;

  // Handlers
  const handleCancelIntent = (slotId: string, startTime: string) => {
    const now = new Date();
    const sessionTime = new Date(startTime);
    const hoursLeft = (sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    setSelectedSlotId(slotId);

    if (hoursLeft < 24) {
      setCanCancel(false);
    } else {
      setCanCancel(true);
    }

    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    if (selectedSlotId && canCancel) {
      cancelBooking(selectedSlotId, {
        onSuccess: () => {
          setIsCancelModalOpen(false);
          setSelectedSlotId(null);
        },
      });
    } else {
      setIsCancelModalOpen(false);
    }
  };

  if (isLoading) return <GlobalLoader />;

  return (
    <div className="min-h-screen bg-[#0d1f17] p-8 space-y-8">
      {/* Header Section */}
      <header className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#00ff94] transition-colors"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
              My Sessions
            </h1>
            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic mt-2">
              Manage your upcoming training appointments
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* ✅ Primary Action: Find a Coach */}
          <button
            onClick={() => navigate("/browse-trainers")}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#00ff94] text-black px-6 py-3.5 rounded-2xl font-black uppercase italic text-[11px] shadow-[0_0_20px_rgba(0,255,148,0.2)] hover:bg-[#00e685] transition-all active:scale-95"
          >
            <Users size={16} strokeWidth={3} />
            Find a Coach
          </button>

          {/* ✅ Secondary Action: Quick Book Slot (Global List) */}
          <button
            onClick={() => navigate("/check-slots")}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-6 py-3.5 rounded-2xl font-black uppercase italic text-[11px] hover:bg-white/10 transition-all active:scale-95"
          >
            <Plus size={16} strokeWidth={3} />
            Quick Book
          </button>

          <div className="hidden lg:flex items-center gap-3 text-[#00ff94] bg-[#00ff94]/5 border border-[#00ff94]/10 px-5 py-3 rounded-2xl">
            <CalendarDays size={18} />
            <span className="text-[10px] font-black uppercase italic tracking-wider">
              {data?.total || 0} Total
            </span>
          </div>
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
                  onCancel={() =>
                    handleCancelIntent(session.slotId, session.startTime)
                  }
                />
              ))}
            </div>

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
          /* ✅ Updated Empty State */
          <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] flex flex-col items-center">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-gray-600 mb-6">
              <Users size={32} />
            </div>
            <p className="text-gray-500 text-xs font-black uppercase italic tracking-widest">
              Your schedule is empty.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                to="/browse-trainers"
                className="bg-[#00ff94] text-black px-8 py-4 rounded-2xl font-black uppercase italic text-[11px] shadow-[0_0_20px_rgba(0,255,148,0.2)]"
              >
                Find Your Coach
              </Link>
              <Link
                to="/check-slots"
                className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-black uppercase italic text-[11px]"
              >
                Browse All Slots
              </Link>
            </div>
          </div>
        )}
      </main>

      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => !isCancelling && setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title={canCancel ? "Cancel Booking?" : "Cancellation Locked"}
        message={
          canCancel
            ? "Are you sure you want to cancel this session? Your slot will be made available to others."
            : "Cancellations are only allowed 24 hours before the session start time. This session starts in less than 24 hours."
        }
        confirmText={
          !canCancel
            ? "Understand"
            : isCancelling
            ? "Cancelling..."
            : "Yes, Cancel"
        }
        variant={canCancel ? "danger" : "warning"}
      />
    </div>
  );
};

export default UpcomingSessions;