import { useState } from "react";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { ManagementHeader } from "../../components/admin/ManagementHeader";
import { DataTable } from "../../components/admin/DataTable";
import { Pagination } from "../../components/admin/Pagination";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTrainerVerificationManagement } from "../../hooks/admin/use-trainer-verification-management";
import type { TrainerVerificationList } from "../../type/user.types";

export default function TrainerVerificationManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const navigate = useNavigate();

  const { data, isLoading } = useTrainerVerificationManagement({
    page,
    search,
    status,
  });

  const trainers = data?.trainers ?? [];
  const total = data?.total ?? 0;

  const columns = [
    {
      header: "#",
      render: (_: TrainerVerificationList, index: number) => (
        <span>{(page - 1) * 10 + index + 1}</span>
      ),
    },
    {
      header: "Name",
      render: (t: TrainerVerificationList) => (
        <div>
          <p className="text-white font-semibold">{t.trainerName}</p>
          <p className="text-xs text-gray-400">{t.email}</p>
        </div>
      ),
    },
    {
      header: "Experience",
      render: (t: TrainerVerificationList) => <span>{t.experienceYear} Years</span>,
    },
    {
      header: "Submitted Date",
      render: (t: TrainerVerificationList) => (
        <span>{new Date(t.createdAt).toLocaleDateString()}</span>
      ),
    },
  {
    header: "Status",
    render: (t: TrainerVerificationList) => {
      const statusStyles =
        t.approvalStatus === "approved"
          ? "bg-green-500/10 text-green-400 border-green-500/30"
          : t.approvalStatus === "rejected"
          ? "bg-red-500/10 text-red-400 border-red-500/30"
          : "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";

      return (
        <div className="flex justify-center">
          <span
            className={`px-4 py-1 text-xs font-bold uppercase tracking-wide rounded-full border ${statusStyles}`}
          >
            {t.approvalStatus}
          </span>
        </div>
      );
    },
  },
    {
      header: "Action",
      render: (t: TrainerVerificationList) => (
        <button
          onClick={() =>
            navigate(`/admin/trainer/verifications/${t.id}`)
          }
          className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-[#00ff94]"
        >
          <Eye size={18} />
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-10 space-y-8">
        <header>
          <h2 className="text-3xl font-black text-white">
            Trainer Verification Management
          </h2>
        </header>

        <ManagementHeader
          placeholder="Search trainer..."
          onSearch={setSearch}
          filters={[
            {
              label: "Approval Status",
              options: [
                { label: "Pending", value: "pending" },
                { label: "Approved", value: "approved" },
                { label: "Rejected", value: "rejected" },
              ],
              onChange: setStatus,
            },
          ]}
        />

        <DataTable columns={columns} data={trainers} isLoading={isLoading} />

        {total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / 10)}
            totalResults={total}
            resultsPerPage={10}
            onPageChange={setPage}
          />
        )}
      </div>
    </AdminLayout>
  );
}