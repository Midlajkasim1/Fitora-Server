import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { DataTable } from "../../components/admin/DataTable";
import { ManagementHeader } from "../../components/admin/ManagementHeader";
import { Pagination } from "../../components/admin/Pagination";
import { 
    Eye,
    AlertCircle,
    FileText,
    Clock,
    CheckCircle
} from "lucide-react";
import { 
    useReportManagement, 
    useReportSummary
} from "../../hooks/admin/use-admin-report-management";
import { useDebounce } from "../../hooks/admin/use-debounce";
import { motion } from "framer-motion";
import React from "react";

export default function ReportManagement() {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [status, setStatus] = useState("");
    const [type, setType] = useState("");
    
    const { data, isLoading } = useReportManagement({
        page,
        search: debouncedSearch,
        status,
        type
    });

    const { data: summary } = useReportSummary();

    const reports = data?.data ?? [];
    const total = data?.total ?? 0;

interface Report {
    id: string;
    reporter?: { profileImage?: string; name?: string; role?: string };
    type: string;
    status: string;
    createdAt: string;
}

    const columns = [
        {
            header: "#",
            render: (_: Report, index: number) => (
                <span className="text-gray-600 font-medium">
                    {(page - 1) * 10 + (index + 1)}
                </span>
            )
        },
        {
            header: "Reporter",
            render: (r: Report) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#00ff94]/10 border border-[#00ff94]/20 flex items-center justify-center overflow-hidden">
                        {r.reporter?.profileImage ? (
                            <img src={r.reporter.profileImage} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <span className="text-[#00ff94] text-xs font-bold uppercase">
                                {r.reporter?.name?.charAt(0) || "U"}
                            </span>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-white italic leading-none uppercase tracking-tight">
                            {r.reporter?.name || "Unknown"}
                        </p>
                        <p className="text-[10px] text-gray-500 lowercase mt-1">{r.reporter?.role || "User"}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Type",
            render: (r: Report) => (
                <span className="text-sm text-gray-400 font-medium italic">{r.type}</span>
            )
        },
        {
            header: "Status",
            render: (r: Report) => (
                <div className={`flex items-center gap-2 px-3 py-1 rounded-full w-fit ${
                    r.status === 'Resolved' ? 'bg-green-500/10 text-green-500' : 
                    r.status === 'Dismissed' ? 'bg-red-500/10 text-red-500' :
                    'bg-yellow-500/10 text-yellow-500'
                }`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${
                        r.status === 'Resolved' ? 'bg-green-500 shadow-[0_0_8px_#22c55e]' : 
                        r.status === 'Dismissed' ? 'bg-red-500 shadow-[0_0_8px_#ef4444]' :
                        'bg-yellow-500 shadow-[0_0_8px_#eab308] animate-pulse'
                    }`} />
                    <span className="text-[10px] font-bold uppercase italic">{r.status}</span>
                </div>
            )
        },
        {
            header: "Date",
            render: (r: Report) => (
                <div className="text-gray-500 text-[11px] font-bold uppercase tracking-widest">
                   {new Date(r.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            )
        },
        {
            header: "Action",
            render: (r: Report) => (
                <div className="flex gap-1">
                    <button 
                        onClick={() => navigate(`/admin/reports/${r.id}`)}
                        className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-[#00ff94] transition-all"
                        title="View Details"
                    >
                        <Eye size={18} />
                    </button>
                    {r.status === "Pending" && (
                         <div className="p-2 text-yellow-500/50" title="Needs Action">
                             <AlertCircle size={14} />
                         </div>
                    )}
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="p-10 space-y-10">
                <header>
                    <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                        Report Management
                    </h2>
                    <p className="text-gray-500 text-xs italic mt-2 font-medium tracking-wide">
                        Review and resolve platform incidents, misconduct reports, and technical issues.
                    </p>
                </header>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SummaryCard 
                        title="Total Reports" 
                        value={summary?.total || 0} 
                        icon={<FileText size={24} />}
                        color="text-[#00ff94]"
                    />
                    <SummaryCard 
                        title="Pending Review" 
                        value={summary?.pending || 0} 
                        icon={<Clock size={24} />}
                        color="text-yellow-500"
                    />
                    <SummaryCard 
                        title="Resolved" 
                        value={summary?.resolved || 0} 
                        icon={<CheckCircle size={24} />}
                        color="text-emerald-500"
                    />
                </div>

                <ManagementHeader
                    placeholder="Search by reporter name or incident..."
                    onSearch={setSearch}
                    filters={[
                        {
                            label: "Status Filter",
                            options: [
                                { label: "Pending", value: "Pending" },
                                { label: "Under Review", value: "Under Review" },
                                { label: "Resolved", value: "Resolved" },
                                { label: "Dismissed", value: "Dismissed" }
                            ],
                            onChange: setStatus
                        },
                        {
                            label: "Incident Type",
                            options: [
                                { label: "Misconduct", value: "Misconduct" },
                                { label: "Payment", value: "Payment" },
                                { label: "Bug", value: "Bug" },
                                { label: "Harassment", value: "Harassment" },
                                { label: "Other", value: "Other" }
                            ],
                            onChange: setType
                        }
                    ]}
                />

                <DataTable columns={columns} data={reports} isLoading={isLoading} />

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

const SummaryCard = ({ title, value, icon, color }: { title: string, value: number, icon: React.ReactElement, color: string }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-[#0b1b16] border border-white/5 p-8 rounded-[2rem] relative group overflow-hidden"
    >
        <div className="flex justify-between items-start relative z-10">
            <div className="space-y-4">
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500 italic leading-none">{title}</p>
                <h3 className="text-5xl font-black text-white italic tracking-tighter">{value}</h3>
            </div>
            <div className={`p-4 bg-white/5 rounded-2xl ${color} shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
        </div>
        <div className="absolute -right-4 -bottom-4 opacity-[0.02] text-white group-hover:opacity-[0.05] transition-opacity transform -rotate-12">
            {React.cloneElement(icon, { size: 120 })}
        </div>
    </motion.div>
);
