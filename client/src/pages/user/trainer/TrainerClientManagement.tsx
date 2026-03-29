import { useState } from "react";
import { Search, } from "lucide-react"; // Added Calendar icon
import { useTrainerClients } from "../../../hooks/trainer/use-trainerClients";
import ClientCard from "../../../components/trainer/ClientCard";
import { Pagination } from "../../../components/admin/Pagination";
import { useDebounce } from "../../../hooks/admin/use-debounce";

const ClientManagement = () => {
  const [activeTab, setActiveTab] = useState<'personal' | 'group'>('personal');
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const RESULTS_PER_PAGE = 6;

  const debouncedSearch = useDebounce(searchTerm, 500);

  const { data, isLoading } = useTrainerClients({
    type: activeTab,
    page: currentPage,
    search: debouncedSearch
  });

  const totalPages = data ? Math.ceil(data.total / RESULTS_PER_PAGE) : 0;

  return (
    <div className="p-8 space-y-8 bg-[#06110d] min-h-screen">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white uppercase tracking-tighter italic">
          Assigned Clients
        </h1>
        <div className="text-[#00ff94] bg-[#00ff94]/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-[#00ff94]/20">
           {data?.total || 0} ACTIVE CLIENTS
        </div>
      </header>

      {/* Search Bar - Removed uppercase */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-[#00ff94] transition-colors" size={18} />
        <input
          type="text"
          value={searchTerm}
          placeholder="Search by name or email..."
          className="w-full bg-[#0d1a16] border border-emerald-900/20 rounded-xl py-4 pl-12 pr-4 text-xs font-bold text-white placeholder:text-gray-600 focus:outline-none focus:border-[#00ff94]/50 transition-all"
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-10 border-b border-white/5">
        {(['personal', 'group'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative italic ${
              activeTab === tab ? "text-[#00ff94]" : "text-gray-600 hover:text-gray-400"
            }`}
          >
            {tab} SESSIONS
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00ff94] shadow-[0_0_10px_#00ff94]" />
            )}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="h-72 bg-[#1a2c26]/50 animate-pulse rounded-2xl border border-white/5" />
           ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.users?.map((client) => (
              <ClientCard key={client.userId} client={client} />
            ))}
          </div>

          {/* Pagination */}
          {data && data.total > 0 && (
            <div className="pt-8 border-t border-white/5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalResults={data.total}
                resultsPerPage={RESULTS_PER_PAGE}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientManagement;