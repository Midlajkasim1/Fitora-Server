import { useState, useMemo } from "react";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { DataTable } from "../../components/admin/DataTable";
import { ManagementHeader } from "../../components/admin/ManagementHeader";
import { Pagination } from "../../components/admin/Pagination";
import { 
    IndianRupee, 
    Activity, 
    Download,
    Check,
    X,
    CreditCard
} from "lucide-react";
import { 
    useAdminDashboardStats,
    useRecentTransactions,
    exportFinanceReport,
    useHandlePayout
} from "../../hooks/admin/use-admin-finance-management";
import { useDebounce } from "../../hooks/admin/use-debounce";
import { motion } from "framer-motion";
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer
} from "recharts";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function FinanceManagement() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    
    const { data: stats } = useAdminDashboardStats(year);
    const { data: transactionsData, isLoading: isTableLoading } = useRecentTransactions({
        page,
        search: debouncedSearch,
        limit: 10
    });
    const { mutate: handlePayout, isPending: isHandlingPayout } = useHandlePayout();

    const transactions = transactionsData?.transactions ?? [];
    const total = transactionsData?.total ?? 0;

    const formattedFinancialData = useMemo(() => {
        if (!stats?.financialStats) return [];
        return MONTHS.map((month, index) => {
            const monthStr = `${year}-${String(index + 1).padStart(2, '0')}`;
            const monthData = stats.financialStats.find((s: any) => s.month === monthStr);
            return {
                name: month,
                revenue: monthData?.totalRevenue || 0,
                profit: monthData?.totalProfit || 0
            };
        });
    }, [stats, year]);

    const exportReport = () => {
        const start = new Date(year, 0, 1).toISOString();
        const end = new Date(year, 11, 31).toISOString();
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
                    <div className="w-8 h-8 rounded-lg bg-[#00ff94]/10 flex items-center justify-center border border-[#00ff94]/20 italic font-black text-[#00ff94] text-xs">
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
                const isExpense = tx.type === "Session Payout" || tx.type === "Withdrawal";
                const isPositive = !isExpense && tx.amount > 0;
                return (
                    <div className={`flex items-center gap-1 font-black italic tracking-tighter ${
                        isPositive ? 'text-[#00ff94]' : 'text-rose-500'
                    }`}>
                        {isPositive ? '+' : '-'}₹{Math.abs(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
        },
        {
            header: "Actions",
            render: (tx: any) => {
                if (tx.type === "Withdrawal" && tx.status === "Pending") {
                    return (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePayout({ id: tx.id, status: 'Success' })}
                                disabled={isHandlingPayout}
                                className="p-2 rounded-lg bg-[#00ff94]/10 text-[#00ff94] hover:bg-[#00ff94] hover:text-black transition-all"
                                title="Approve Payout"
                            >
                                <Check size={14} />
                            </button>
                            <button
                                onClick={() => handlePayout({ id: tx.id, status: 'Failed' })}
                                disabled={isHandlingPayout}
                                className="p-2 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                                title="Reject Payout"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    );
                }
                return <span className="text-[10px] text-gray-700 italic">No Action</span>;
            }
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
                        Export Report
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Revenue" 
                        value={stats?.statsCards?.totalRevenue || 0}
                        icon={<IndianRupee size={20} />}
                        isCurrency
                        delay={0.1}
                    />
                    <StatCard 
                        title="Total Subscriptions" 
                        value={stats?.statsCards?.totalSubscriptions || 0}
                        icon={<CreditCard size={20} />}
                        delay={0.2}
                    />
                    {stats?.statsCards?.planStats?.map((plan: any, index: number) => (
                        <StatCard 
                            key={plan.name}
                            title={`${plan.name} Plan`} 
                            value={plan.count}
                            icon={<Activity size={20} />}
                            delay={0.3 + index * 0.1}
                        />
                    ))}
                </div>

                {/* Revenue Analytics Chart */}
                <div className="bg-[#0b1b16] border border-white/5 p-8 rounded-[2rem] relative overflow-hidden h-[450px]">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#00ff94] italic mb-1">Revenue Overview</p>
                            <h3 className="text-2xl font-black text-white italic tracking-tight">Analytics Trends</h3>
                        </div>
                        <select 
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white font-bold italic text-xs appearance-none focus:outline-none"
                        >
                            {[2024, 2025, 2026].map(y => (
                                <option key={y} value={y} className="bg-[#0b1b16]">{y}</option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="w-full h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={formattedFinancialData}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00ff94" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#00ff94" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#00ff94" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Ledger Section */}
                <div className="space-y-6">
                    <header className="flex justify-between items-center px-2">
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
                            <Activity className="text-[#00ff94]" size={20} />
                            Transaction Ledger
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

const StatCard = ({ title, value, icon, isCurrency, delay }: any) => (
    <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        whileHover={{ y: -5 }}
        className="bg-[#0b1b16] border border-white/5 p-6 rounded-[2rem] relative group"
    >
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                 <div className="text-gray-500 group-hover:text-[#00ff94] transition-colors">{icon}</div>
                 <p className="text-[10px] font-black uppercase tracking-tight text-gray-500 italic leading-none">{title}</p>
            </div>
            <h3 className="text-3xl font-black text-white italic tracking-tighter pt-2">
                {isCurrency ? '₹' : ''}{value.toLocaleString(undefined, { minimumFractionDigits: 0 })}
            </h3>
        </div>
    </motion.div>
);

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#0b1b16] border border-white/10 p-4 rounded-xl shadow-2xl">
                <p className="text-[10px] font-black text-gray-500 uppercase italic mb-2 tracking-widest">{label}</p>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ff94]" />
                    <span className="text-xs font-bold text-white italic">Revenue: ₹{payload[0].value.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};
