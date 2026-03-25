import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Pencil, Power } from "lucide-react";
import type { SubscriptionManagement } from "../../../type/admin.types";
import { useSubscriptionToggle } from "../../../hooks/admin/subscription/use-subscription-toggle";
import { useSubcriptionManagement } from "../../../hooks/admin/subscription/use-admin-subcription-management";
import { ConfirmModal } from "../../../shared/ConfirmModal";
import { Pagination } from "../../../components/admin/Pagination";
import { DataTable } from "../../../components/admin/DataTable";
import { AdminLayout } from "../../../layout/admin/AdminLayout";
import { ManagementHeader } from "../../../components/admin/ManagementHeader";

export default function SubscriptionManagementPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetSub, setTargetSub] = useState<SubscriptionManagement | null>(null);

  const navigate = useNavigate();
  const { data, isLoading } = useSubcriptionManagement({ page, search, status });
  const toggleMutation = useSubscriptionToggle();

  const subscriptions = data?.subscriptions ?? [];
  const total = data?.totals ?? 0;
  
  const handleToggleStatus = () => {
    if (targetSub) {
      toggleMutation.mutate(targetSub.id);
      setIsModalOpen(false);
    }
  };

  const columns = [
    {
      header: "Plan Name",
      render: (item: SubscriptionManagement) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#00ff94]/10 flex items-center justify-center">
             <Plus size={14} className="text-[#00ff94]" />
          </div>
          <span className="text-white font-bold italic uppercase tracking-tight">{item.name}</span>
        </div>
      )
    },
    {
      header: "Price",
      render: (item: SubscriptionManagement) => (
        <span className="text-[#00ff94] font-black italic">
          {typeof item.price === 'number' ? `₹ ${item.price}` : item.price}
        </span>
      )
    },
    {
      header: "Billing Cycle",
      render: (item: SubscriptionManagement) => (
        <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-[10px] font-bold uppercase italic text-gray-400">
          {item.billingCycle}
        </span>
      )
    },
    {
      header: "Status",
      render: (item: SubscriptionManagement) => (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${
          item.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'
        }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-gray-500'}`} />
          <span className="text-[10px] font-bold uppercase italic">{item.status}</span>
        </div>
      )
    },
    {
      header: "Total Users",
      render: (item: SubscriptionManagement) => (
        <span className="text-white font-bold tabular-nums">{item.totalPurchaseUser.toLocaleString()}</span>
      )
    },
    {
      header: "Actions",
      render: (item: SubscriptionManagement) => (
        <div className="flex gap-1">
          <button 
            onClick={() => navigate(`/admin/edit-subscriptions/${item.id}`)}
            className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-[#00ff94] transition-all"
          >
            <Pencil size={18} />
          </button>
          <button 
            onClick={() => { setTargetSub(item); setIsModalOpen(true); }}
            className={`p-2 rounded-xl transition-all ${
              item.status === 'active' ? 'text-gray-500 hover:text-red-500' : 'text-[#00ff94]'
            }`}
          >
            <Power size={18} />
          </button>
        </div>
      )
    }
  ];

  return (
    <AdminLayout>
      <div className="p-10 space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">Subscription Plans</h2>
            <p className="text-gray-500 text-xs italic mt-2 font-medium tracking-wide">Manage your fitness app pricing tiers and billing cycles.</p>
          </div>
          <button 
            onClick={() => navigate("/admin/create-subscriptions")}
            className="flex items-center gap-2 bg-[#00ff94] text-black px-6 py-3 rounded-xl font-bold text-[11px] uppercase italic hover:shadow-[0_0_20px_rgba(0,255,148,0.3)] transition-all"
          >
            <Plus size={18} /> Create New Plan
          </button>
        </header>

        <ManagementHeader 
          placeholder="Search plans..." 
          onSearch={setSearch}
          filters={[
            {
              label: "Filter Status",
              options: [
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" }
              ],
              onChange: setStatus
            }
          ]}
        />

        <DataTable columns={columns} data={subscriptions} isLoading={isLoading} />

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
          onConfirm={handleToggleStatus}
          title={targetSub?.status === 'active' ? "Deactivate Plan?" : "Activate Plan?"}
          message={`Are you sure you want to set the ${targetSub?.name} plan to ${targetSub?.status === 'active' ? 'inactive' : 'active'}?`}
          confirmText={targetSub?.status === 'active' ? "Deactivate" : "Activate"}
        />
      </div>
    </AdminLayout>
  );
}