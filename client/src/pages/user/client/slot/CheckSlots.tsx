import { useState, useMemo } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAvailableSlots } from "../../../../hooks/user/slot/use-availableSlots";
import { useBookSlot } from "../../../../hooks/user/slot/use-bookSlot";
import { GlobalLoader } from "../../../../shared/GlobalLoader";
import { AvailableSlotCard } from "../../../../components/user/AvailableSlotCard";
import { Pagination } from "../../../../components/admin/Pagination";
import { useDebounce } from "../../../../hooks/admin/use-debounce";

const CheckSlots = () => {
  const [searchParams] = useSearchParams();
  const trainerId = searchParams.get("trainerId") || undefined;

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const LIMIT = 6;

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useAvailableSlots(
    currentPage, 
    LIMIT, 
    debouncedSearch, 
    trainerId
  );
  
  const { mutate: bookSession, isPending, variables } = useBookSlot();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // ✅ 3. Group slots by date for the timeline UI
  const groupedSlots = useMemo(() => {
    const slots = data?.slots;
    if (!slots) return {};

    return slots.reduce((acc: Record<string, any[]>, slot: any) => {
      const date = new Date(slot.startTime).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(slot);
      return acc;
    }, {});
  }, [data]);

  if (isLoading && !data) return <GlobalLoader />;

  const totalPages = data ? Math.ceil(data.total / LIMIT) : 0;

  // Determine dynamic title
  const displayTitle = trainerId && data?.slots?.[0] 
    ? `Schedule with ${data.slots[0].trainerName}` 
    : "Find A Session";

  return (
    <div className="min-h-screen bg-[#0d1f17] p-8 space-y-10">
      <header className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <Link
              // ✅ 4. Back button logic: if from trainer selection, go back there
              to={trainerId ? "/browse-trainers" : "/upcoming-sessions"}
              className="p-3 bg-white/5 rounded-xl text-gray-400 hover:text-[#00ff94] transition-all"
            >
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
                {displayTitle}
              </h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest italic">
                {trainerId ? "Select your preferred time" : "Based on your plan & preferences"}
              </p>
            </div>
          </div>

          {/* Search bar is hidden when viewing a specific trainer's slots to keep it clean */}
          {!trainerId && (
            <div className="relative w-full md:w-96">
              <Search
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  searchTerm !== debouncedSearch
                    ? "text-[#00ff94] animate-pulse"
                    : "text-gray-500"
                }`}
                size={18}
              />
              <input
                type="text"
                placeholder="Search Trainer..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full bg-[#132a1e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white text-xs font-bold uppercase italic focus:border-[#00ff94] outline-none transition-all"
              />
            </div>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto pb-20">
        {Object.keys(groupedSlots).length > 0 ? (
          <>
            {Object.entries(groupedSlots).map(([date, dateSlots]: any) => (
              <section
                key={date}
                className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="h-px flex-1 bg-white/5"></div>
                  <h3 className="text-[#00ff94] text-[10px] font-black uppercase italic tracking-[0.3em] whitespace-nowrap">
                    {date}
                  </h3>
                  <div className="h-px flex-1 bg-white/5"></div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {dateSlots.map((slot: any) => (
                    <AvailableSlotCard
                      key={slot.id}
                      slot={slot}
                      onBook={(id) => bookSession(id)}
                      isBooking={isPending && variables === slot.id}
                    />
                  ))}
                </div>
              </section>
            ))}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalResults={data?.total || 0}
              resultsPerPage={LIMIT}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        ) : (
          <div className="py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem]">
            <p className="text-gray-600 text-sm font-black uppercase italic">
              {trainerId 
                ? "This coach has no available sessions at the moment." 
                : "No matching sessions found."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CheckSlots;