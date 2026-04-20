import { useState } from "react";
import { Plus, Pause, Play, Edit2, Megaphone } from "lucide-react";
import { format } from "date-fns";
import { useAdvertisementManagement } from "../../../hooks/admin/advertisement/use-admin-advertisements";
import { ManagementHeader } from "../../../components/admin/ManagementHeader";
import { DataTable } from "../../../components/admin/DataTable";
import { Pagination } from "../../../components/admin/Pagination";
import { useAdvertisementToggleStatus } from "../../../hooks/admin/advertisement/use-admin-adToggleStatus";
import { AdminLayout } from "../../../layout/admin/AdminLayout";
import { ConfirmModal } from "../../../shared/ConfirmModal"; 
import { useDebounce } from "../../../hooks/admin/use-debounce";
import { useNavigate } from "react-router-dom";
import type { AdvertisementManagement } from "../../../type/admin.types";
const AdManagement = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetAd, setTargetAd] = useState<AdvertisementManagement | null>(null);

  const navigate = useNavigate();

  const { data, isLoading } = useAdvertisementManagement({ page, search: debouncedSearch, status });
  const toggleStatus = useAdvertisementToggleStatus();
  const handleToggle = () => {
    if (targetAd) {
      toggleStatus.mutate(targetAd.id);
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      header: "Ad Name",
      render: (ad: AdvertisementManagement) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
            {ad.bannerImages?.[0] ? (
              <img src={ad.bannerImages[0]} alt="" className="w-full h-full object-cover" />
            ) : (
              <Megaphone size={18} className="text-gray-600" />
            )}
          </div>
          <div>
            <p className="text-sm font-bold text-white italic uppercase tracking-tight">{ad.brandName}</p>
            <p className="text-[10px] text-gray-500 font-mono mt-1">ID: #{ad.id.slice(-6).toUpperCase()}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Expiry Date",
      render: (ad: AdvertisementManagement) => (
        <span className="text-[11px] font-bold text-gray-400 uppercase italic">
          {format(new Date(ad.expiryDate), "MMM dd, yyyy")}
        </span>
      ),
    },
    {
      header: "Status",
      render: (ad: AdvertisementManagement) => {
        const isExpired = new Date(ad.expiryDate) < new Date();
        const displayStatus = isExpired ? "expired" : ad.status;

        const colors: Record<string,string> = {
          active: "bg-[#00ff94]/10 text-[#00ff94]",
          blocked: "bg-orange-500/10 text-orange-500",
          expired: "bg-red-500/10 text-red-500",
        };

        return (
          <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase italic tracking-widest inline-flex items-center gap-2 ${colors[displayStatus]}`}>
            <span className={`w-1.5 h-1.5 rounded-full bg-current`} />
            {displayStatus}
          </div>
        );
      },
    },
    {
      header: "Actions",
      render: (ad: AdvertisementManagement) => (
        <div className="flex items-center gap-1">
          <button 
            onClick={() => { setTargetAd(ad); setIsModalOpen(true); }}
            className={`p-2 rounded-xl transition-all ${ad.status === 'blocked' ? 'text-[#00ff94] hover:bg-[#00ff94]/10' : 'text-gray-500 hover:text-orange-500 hover:bg-orange-500/10'}`}
          >
            {ad.status === "active" ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button 
            onClick={() => navigate(`/admin/edit-advertisement/${ad.id}`)}
            className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-[#00ff94] transition-all"
          >
            <Edit2 size={18} />
          </button>
          
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-10 space-y-8 animate-in fade-in duration-500">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Ad Management</h1>
            <p className="text-gray-500 text-xs mt-2 uppercase tracking-widest font-bold">Manage promotional banners</p>
          </div>
          <button 
            onClick={() => navigate("/admin/create-advertisement")}
            className="flex items-center gap-2 bg-[#00ff94] text-black px-6 py-3 rounded-xl font-bold uppercase italic text-xs hover:shadow-[0_0_20px_rgba(0,255,148,0.3)] transition-all"
          >
            <Plus size={18} />
            Create New Ad
          </button>
        </header>

        <ManagementHeader
          placeholder="Search by ad name..."
          onSearch={setSearch}
          filters={[
            {
              label: "Filter Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Blocked", value: "blocked" },
              ],
              onChange: setStatus,
            },
          ]}
        />

        <DataTable
          columns={columns} 
          data={data?.Advertisement || []} 
          isLoading={isLoading} 
        />

        {data && data.total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(data.total / 10)}
            totalResults={data.total}
            resultsPerPage={10}
            onPageChange={setPage}
          />
        )}

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleToggle}
          title={targetAd?.status === 'active' ? "Pause Advertisement?" : "Activate Advertisement?"}
          message={`Are you sure you want to ${targetAd?.status === 'active' ? 'pause' : 'activate'} "${targetAd?.brandName}"?`}
          confirmText={targetAd?.status === 'active' ? "Pause" : "Activate"}
        />
      </div>
    </AdminLayout>
  );
};

export default AdManagement;