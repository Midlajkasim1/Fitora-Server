import { useState } from "react";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { DataTable } from "../../components/admin/DataTable";
import { ManagementHeader } from "../../components/admin/ManagementHeader";
import { Pagination } from "../../components/admin/Pagination";
import { 
    TrendingUp, 
    TrendingDown, 
    DollarSign, 
    Activity, 
    PieChart, 
    Users,
    Download,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { 
    useFinanceOverview, 
    useRecentTransactions,
    exportFinanceReport
} from "../../hooks/admin/use-admin-finance-management";
import { useDebounce } from "../../hooks/admin/use-debounce";
import { motion } from "framer-motion";
import React from "react";

export default function FinanceManagement() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    
    const { data: overview, isLoading: isOverviewLoading } = useFinanceOverview();
    const { data: transactionsData, isLoading: isTableLoading } = useRecentTransactions({
        page,
        search: debouncedSearch,
        limit: 10
    });

    const transactions = transactionsData?.transactions ?? [];
    const total = transactionsData?.total ?? 0;

    const exportReport = () => {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const end = now.toISOString();
        exportFinanceReport(start, end);
    };

    const columns = [
        {
            header: "TX ID",
            render: (tx: any) => (
                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-tighter">
                    #{tx.id.slice(-8)}
                </span>
            )
        },
        {
            header: "Entity",
            render: (tx: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 italic font-black text-[#00ff94] text-xs">
                        {tx.entityName?.charAt(0) || "F"}
                    </div>
                    <div>
                        <p className="font-bold text-white italic leading-none uppercase tracking-tight text-xs">
                            {tx.entityName}
                        </p>
                        <p className="text-[9px] text-gray-500 lowercase mt-1">{tx.description}</p>
                    </div>
                </div>
            )
        },
        {
            header: "Type",
            render: (tx: any) => (
                <span className="text-[10px] text-gray-400 font-bold uppercase italic tracking-wider">{tx.type}</span>
            )
        },
        {
            header: "Amount",
            render: (tx: any) => {
                const isPositive = tx.amount > 0;
                return (
                    <div className={`flex items-center gap-1 font-black italic tracking-tighter ${
                        isPositive ? 'text-[#00ff94]' : 'text-rose-500'
                    }`}>
                        {isPositive ? '+' : ''}${Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                );
            }
        },
        {
            header: "Status",
            render: (tx: any) => (
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 w-fit">
                    <div className={`w-1 h-1 rounded-full ${
                        tx.status === 'Success' ? 'bg-[#00ff94] shadow-[0_0_8px_#00ff94]' : 
                        tx.status === 'Pending' ? 'bg-yellow-500' : 'bg-rose-500'
                    }`} />
                    <span className="text-[9px] font-black uppercase text-gray-400">{tx.status}</span>
                </div>
            )
        }
    ];

    return (
        <AdminLayout>
            <div className="p-10 space-y-10">
                <header className="flex justify-between items-end">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                            Finance Management
                        </h2>
                        <p className="text-gray-500 text-xs italic mt-2 font-medium tracking-wide">
                            Real-time financial analytics, revenue tracking, and automated ledger management.
                        </p>
                    </div>
                    <button 
                        onClick={exportReport}
                        className="flex items-center gap-2 px-6 py-3 bg-[#00ff94] text-black font-black uppercase italic text-xs rounded-xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,255,148,0.2)]"
                    >
                        <Download size={14} />
                        Generate Report
                    </button>
                </header>

                {/* Growth Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Profit" 
                        value={overview?.summary?.totalProfit || 0}
                        growth={overview?.summary?.growth?.profit || 0}
                        icon={<DollarSign size={20} />}
                        isCurrency
                    />
                    <StatCard 
                        title="Ad Revenue" 
                        value={overview?.summary?.adRevenue || 0}
                        growth={overview?.summary?.growth?.revenue || 0}
                        icon={<Activity size={20} />}
                        isCurrency
                    />
                    <StatCard 
                        title="Platform Commission" 
                        value={overview?.summary?.commissionEarnings || 0}
                        growth={overview?.summary?.growth?.commission || 0}
                        icon={<PieChart size={20} />}
                        isCurrency
                    />
                    <StatCard 
                        title="Trainer Earnings" 
                        value={overview?.summary?.trainerEarnings || 0}
                        growth={overview?.summary?.growth?.trainerEarnings || 0}
                        icon={<Users size={20} />}
                        isCurrency
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Revenue Trends Placeholder */}
                    <div className="lg:col-span-2 bg-[#0b1b16] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden h-[400px]">
                         <div className="flex justify-between items-start mb-8">
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-[#00ff94] italic mb-1">Revenue Overview</p>
                                 <h3 className="text-2xl font-black text-white italic tracking-tight">Analytics Trends</h3>
                             </div>
                             <div className="flex gap-4">
                                <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-gray-500 italic">
                                    <div className="w-2 h-2 rounded-full bg-[#00ff94]" /> Commission
                                </div>
                                <div className="flex items-center gap-2 text-[9px] uppercase font-bold text-gray-500 italic">
                                    <div className="w-2 h-2 rounded-full bg-blue-500" /> Ad Revenue
                                </div>
                             </div>
                         </div>
                         
                         {/* Simple SVG Chart Replacement for Recharts */}
                         <div className="w-full h-[250px] mt-10 relative flex items-end justify-between px-4">
                            {[1,2,3,4,5,6,7].map((i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="w-full flex items-end justify-center gap-1 h-full px-2">
                                        <div 
                                            className="w-full bg-[#00ff94]/20 border border-[#00ff94]/30 rounded-t-lg transition-all group-hover:bg-[#00ff94]/40"
                                            style={{ height: `${Math.random() * 80 + 20}%` }}
                                        />
                                        <div 
                                            className="w-full bg-blue-500/20 border border-blue-500/30 rounded-t-lg transition-all group-hover:bg-blue-500/40"
                                            style={{ height: `${Math.random() * 60 + 10}%` }}
                                        />
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-600 uppercase">Day {i}</span>
                                </div>
                            ))}
                            {/* Grid Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-5">
                                {[1,2,3,4].map(i => <div key={i} className="w-full h-px bg-white" />)}
                            </div>
                         </div>
                    </div>

                    {/* Subscription Amount Card */}
                    <div className="bg-[#0b1b16] border border-white/5 p-8 rounded-[2rem] flex flex-col justify-between relative overflow-hidden">
                        <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-[#00ff94] italic mb-1">Subscriptions</p>
                             <h3 className="text-2xl font-black text-white italic tracking-tight">Revenue Split</h3>
                        </div>

                        <div className="space-y-6 my-8">
                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase italic">Premium Plans</span>
                                    <span className="text-lg font-black text-[#00ff94] italic">${overview?.subscriptionSplit?.premium.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#00ff94] shadow-[0_0_10px_rgba(0,255,148,0.5)] transition-all duration-1000"
                                        style={{ width: `${(overview?.subscriptionSplit?.premium / overview?.subscriptionSplit?.total) * 100 || 0}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase italic">Basic Plans</span>
                                    <span className="text-lg font-black text-white italic">${overview?.subscriptionSplit?.basic.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-white/20 transition-all duration-1000"
                                        style={{ width: `${(overview?.subscriptionSplit?.basic / overview?.subscriptionSplit?.total) * 100 || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/5 text-center">
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1 italic">Monthly Subscription Revenue</p>
                            <h4 className="text-3xl font-black text-white italic tracking-tighter">${overview?.subscriptionSplit?.total.toLocaleString()}</h4>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <header className="flex justify-between items-center px-2">
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
                            <Activity className="text-[#00ff94]" size={20} />
                            Recent Transactions
                        </h3>
                    </header>
                    
                    <ManagementHeader
                        placeholder="Search transactions by entity, type or ID..."
                        onSearch={setSearch}
                    />

                    <DataTable columns={columns} data={transactions} isLoading={isTableLoading} />

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
            </div>
        </AdminLayout>
    );
}

const StatCard = ({ title, value, growth, icon, isCurrency }: { title: string, value: number, growth: number, icon: any, isCurrency?: boolean }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="bg-[#0b1b16] border border-white/5 p-6 rounded-[2rem] relative group"
    >
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                 <div className="text-gray-500 group-hover:text-[#00ff94] transition-colors">{icon}</div>
                 <p className="text-[10px] font-black uppercase tracking-tight text-gray-500 italic leading-none">{title}</p>
            </div>
            <h3 className="text-3xl font-black text-white italic tracking-tighter pt-2">
                {isCurrency ? '$' : ''}{value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h3>
            <div className="flex items-center gap-1 pt-1">
                {growth >= 0 ? (
                    <TrendingUp size={12} className="text-[#00ff94]" />
                ) : (
                    <TrendingDown size={12} className="text-rose-500" />
                )}
                <span className={`text-[10px] font-black italic tracking-wide ${growth >= 0 ? 'text-[#00ff94]' : 'text-rose-500'}`}>
                    {growth > 0 ? '+' : ''}{growth}%
                </span>
                <span className="text-[9px] text-gray-600 font-bold uppercase tracking-tighter ml-1">vs last period</span>
            </div>
        </div>
    </motion.div>
);
