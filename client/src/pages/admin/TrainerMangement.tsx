import { useState } from "react";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { DataTable } from "../../components/admin/DataTable";
import { ManagementHeader } from "../../components/admin/ManagementHeader";
import { Pagination } from "../../components/admin/Pagination";
import { ConfirmModal } from "../../shared/ConfirmModal";
import { useManagementData } from "../../hooks/admin/use-management-data";
import type { User } from "../../type/auth.types"; // Reuse User type or create Trainer type
import { Ban, Eye, CheckCircle } from "lucide-react";
import api from "../../api/axios";
import { toggleTrainerBlock } from "../../api/admin.api";

export default function TrainerManagement() {
  const { 
    data: trainers, 
    total, 
    isLoading, 
    page, 
    setPage, 
    setSearch, 
    setStatus, 
    fetchData: fetchTrainers 
  } = useManagementData<User>("/admin/trainers"); // Hits the trainer endpoint

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetTrainer, setTargetTrainer] = useState<User | null>(null);

  const handleBlockToggle = async () => {
  if (!targetTrainer) return;
  try {
    await toggleTrainerBlock(targetTrainer.id);
    fetchTrainers(); 
    setIsModalOpen(false);
  } catch (error) {
    console.error("Trainer status update failed:", error);
  }
};

  const columns = [
    { 
      header: "#", 
      render: (_: any, index: number) => (
        <span className="text-gray-600 font-medium">{(page - 1) * 10 + (index + 1)}</span>
      ) 
    },
    { 
      header: "Trainer", 
      render: (t: User) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00ff94]/10 border border-[#00ff94]/20 flex items-center justify-center overflow-hidden">
            {t.profileImage ? (
              <img src={t.profileImage} className="w-full h-full object-cover" alt="" />
            ) : (
              <span className="text-[#00ff94] text-xs font-bold uppercase">{t.firstName?.charAt(0)}</span>
            )}
          </div>
          <div>
            <p className="font-bold text-white italic leading-none uppercase tracking-tight">{t.firstName} {t.lastName}</p>
            <p className="text-[10px] text-gray-500 lowercase mt-1">{t.email}</p>
          </div>
        </div>
      )
    },
    { 
      header: "Status", 
      render: (t: User) => (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${
          t.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${
            t.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
          }`} />
          <span className="text-[10px] font-bold uppercase italic">{t.status}</span>
        </div>
      )
    },
    {
      header: "Actions",
      render: (t: User) => (
        <div className="flex gap-1">
          <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-[#00ff94] transition-all" title="View Profile">
            <Eye size={18} />
          </button>
          <button 
            onClick={() => { setTargetTrainer(t); setIsModalOpen(true); }}
            className={`p-2 rounded-xl transition-all ${
              t.status === 'blocked' 
                ? 'text-[#00ff94] hover:bg-[#00ff94]/10' 
                : 'text-gray-500 hover:text-red-500 hover:bg-red-500/10'
            }`}
          >
            <Ban size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="p-10 space-y-8">
        <header>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Trainer Management</h2>
          <p className="text-gray-500 text-xs italic mt-2 font-medium tracking-wide">Review trainer credentials, manage status, and oversee coaching activity.</p>
        </header>

        <ManagementHeader 
          placeholder="Search trainers..."
          onSearch={setSearch}
          filters={[{ 
            label: "Filter Status", 
            options: [{ label: "Active", value: "active" }, { label: "Blocked", value: "blocked" }],
            onChange: setStatus
          }]}
        />

        <DataTable columns={columns} data={trainers} isLoading={isLoading} />

        <Pagination 
          currentPage={page} 
          totalPages={Math.ceil(total / 10)} 
          totalResults={total} 
          resultsPerPage={10} 
          onPageChange={setPage} 
        />

        <ConfirmModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBlockToggle}
          title={targetTrainer?.status === 'blocked' ? "Restore Trainer?" : "Suspend Trainer?"}
          message={targetTrainer?.status === 'blocked' 
            ? `Restore access for ${targetTrainer?.firstName}?`
            : `Suspend ${targetTrainer?.firstName}? Access to the trainer dashboard will be revoked.`}
          confirmText={targetTrainer?.status === 'blocked' ? "Restore" : "Suspend"}
        />
      </div>
    </AdminLayout>
  );
}