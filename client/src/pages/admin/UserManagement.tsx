import { useState } from "react";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { DataTable } from "../../components/admin/DataTable";
import { ManagementHeader } from "../../components/admin/ManagementHeader";
import { Pagination } from "../../components/admin/Pagination";
import { ConfirmModal } from "../../shared/ConfirmModal";

import { Ban, Eye } from "lucide-react";
import { useUserManagement } from "../../hooks/admin/use-admin-user-management";
import { useToggleUserBlock } from "../../hooks/admin/use-userToggleBlock";
import { useDebounce } from "../../hooks/admin/use-debounce";
import type { UserManagement as UserData } from "../../type/admin.types";

export default function UserManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [status, setStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetUser, setTargetUser] = useState<UserData | null>(null);

  const {data,isLoading} = useUserManagement({
    page,
    search: debouncedSearch,
    status
  });
  const users = data?.users ?? [];
  const total = data?.total ?? 0;
const toggleMutation = useToggleUserBlock();

const handleBlockToggle = () =>{
  if(!targetUser)return;
  toggleMutation.mutate(targetUser.id);
  setIsModalOpen(false);
}





  const columns = [
    {
      header: "#",
      render: (_: UserData, index: number) => (
        <span className="text-gray-600 font-medium">
          {(page - 1) * 10 + (index + 1)}
        </span>
      )
    },
    {
      header: "User",
      render: (u: UserData) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00ff94]/10 border border-[#00ff94]/20 flex items-center justify-center overflow-hidden">
            {u.profileImage ? (
              <img src={u.profileImage} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <span className="text-[#00ff94] text-xs font-bold uppercase">
                {u.firstName?.charAt(0) || "U"}
              </span>
            )}
          </div>
          <div>
            <p className="font-bold text-white italic leading-none uppercase tracking-tight">
              {u.firstName} {u.lastName}
            </p>
            <p className="text-[10px] text-gray-500 lowercase mt-1">{u.email}</p>
          </div>
        </div>
      )
    },
    {
      header: "Status",
      render: (u: UserData) => (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${u.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
          }`}>
          <div className={`w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 'bg-red-500 shadow-[0_0_8px_#ef4444]'
            }`} />
          <span className="text-[10px] font-bold uppercase italic">{u.status}</span>
        </div>
      )
    },
    {
      header: "Action",
      render: (u: UserData) => (
        <div className="flex gap-1">
          <button className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-[#00ff94] transition-all">
            <Eye size={18} />
          </button>
          <button
            onClick={() => { setTargetUser(u); setIsModalOpen(true); }}
            className={`p-2 rounded-xl transition-all ${u.status === 'blocked'
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
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            User Management
          </h2>
          <p className="text-gray-500 text-xs italic mt-2 font-medium tracking-wide">
            Manage client accounts, monitor status, and control platform access.
          </p>
        </header>

        <ManagementHeader
          placeholder="Search by name or email..."
          onSearch={setSearch}
          filters={[
            {
              label: "Status Filter",
              options: [
                { label: "Active", value: "active" },
                { label: "Blocked", value: "blocked" }
              ],
              onChange: setStatus
            }
          ]}
        />

        <DataTable<UserData> columns={columns} data={users} isLoading={isLoading} />

        {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / 10)}
            totalResults={total}
            resultsPerPage={10}
            onPageChange={setPage}
          />
        )}

        <ConfirmModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleBlockToggle}
          title={targetUser?.status === 'blocked' ? "Unblock User?" : "Block User?"}
          message={
            targetUser?.status === 'blocked'
              ? `Are you sure you want to restore access for ${targetUser?.email}?`
              : `Are you sure you want to block ${targetUser?.email}? They will lose access immediately.`
          }
          confirmText={targetUser?.status === 'blocked' ? "Unblock" : "Block"}
        />
      </div>
    </AdminLayout>
  );
}