import { Ban, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataTable } from "../../../components/admin/DataTable";
import { ManagementHeader } from "../../../components/admin/ManagementHeader";
import { Pagination } from "../../../components/admin/Pagination";
import { useSpecializationManagement } from "../../../hooks/admin/specialization/use-admin-specializations";
import { useSpecializationToggleBlock } from "../../../hooks/admin/specialization/use-SpecializationToggleBlock";
import { AdminLayout } from "../../../layout/admin/AdminLayout";
import { ConfirmModal } from "../../../shared/ConfirmModal";
import type { getSpecializations } from "../../../type/admin.types";



export default function SpecializationManagement() {
    const [page, setPages] = useState(1);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [targetSpecialization, setTargetSpecialization] = useState<getSpecializations | null>(null);
    const { data, isLoading } = useSpecializationManagement({
        page,
        search,
        status
    });
    const navigate = useNavigate();

    const specializations = data?.specialization ?? [];
    const total = data?.total ?? 0;

    const toggleMutation = useSpecializationToggleBlock();
    const handleBlockToggle = () => {
        if (!targetSpecialization) return;
        toggleMutation.mutate(targetSpecialization.id);
        setIsModalOpen(false);
    }


    const columns = [
        {
            header: "#",
            render: (_: getSpecializations, index: number) => (
                <span>{(page - 1) * 10 + index + 1}</span>
            )
        },
        {
            header: "Image",
            render: (item: getSpecializations) => (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
                    {item.imageUrl ? (
                        <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-xs text-white flex items-center justify-center h-full">
                            No Image
                        </span>
                    )}
                </div>
            )
        },
        {
            header: "Name",
            render: (item: getSpecializations) => (
                <span className="text-white font-semibold">
                    {item.name}
                </span>
            )
        },
        {
            header: "Description",
            render: (item: getSpecializations) => (
                <span className="text-gray-400 text-sm">
                    {item.description || "-"}
                </span>
            )
        },
        {
            header: "Status",
            render: (item: getSpecializations) => (
                <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${item.status === "active"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                        }`}
                >
                    <div
                        className={`w-1.5 h-1.5 rounded-full ${item.status === "active"
                            ? "bg-green-500 shadow-[0_0_8px_#22c55e]"
                            : "bg-red-500 shadow-[0_0_8px_#ef4444]"
                            }`}
                    />
                    <span className="text-[10px] font-bold uppercase italic">
                        {item.status}
                    </span>
                </div>
            ),
        },
        {
            header: "Actions",
            render: (s: getSpecializations) => (
                <div className="flex gap-1">

                    <button
                   onClick={() => navigate(`/admin/edit-specializations/${s.id}`)}
                        className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-[#00ff94] transition-all"
                        title="Edit Specialization"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        onClick={() => { setTargetSpecialization(s); setIsModalOpen(true); }}
                        className={`p-2 rounded-xl transition-all ${s.status === 'blocked'
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

                <header className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-black text-white">
                            Specialization Management
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Manage all trainer specializations.
                        </p>
                    </div>

                    <button
                        onClick={() =>navigate("/admin/create-specializations")}
                        className="flex items-center gap-2 bg-[#00ff94] text-black px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition"
                    >
                        <Plus size={18} />
                        Create Specialization
                    </button>
                </header>

                <ManagementHeader
                    placeholder="Search specialization..."
                    onSearch={setSearch}
                    filters={[
                        {
                            label: "Status",
                            options: [
                                { label: "Active", value: "active" },
                                { label: "Blocked", value: "blocked" }
                            ],
                            onChange: setStatus
                        }
                    ]}
                />

                <DataTable
                    columns={columns}
                    data={specializations}
                    isLoading={isLoading}
                />

                {total > 0 && (
                    <Pagination
                        currentPage={page}
                        totalPages={Math.ceil(total / 10)}
                        totalResults={total}
                        resultsPerPage={10}
                        onPageChange={setPages}
                    />
                )}
                <ConfirmModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onConfirm={handleBlockToggle}
                    title={targetSpecialization?.status === 'blocked' ? "Restore Trainer?" : "Suspend Trainer?"}
                    message={targetSpecialization?.status === 'blocked'
                        ? `Restore access for ${targetSpecialization?.name}?`
                        : `Suspend ${targetSpecialization?.name}? Access to the trainer dashboard will be revoked.`}
                    confirmText={targetSpecialization?.status === 'blocked' ? "Restore" : "Suspend"}
                />
            </div>
        </AdminLayout>
    )
}