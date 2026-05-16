import { AdminSidebar } from "../../layout/admin/AdminSideBar";
import { AdminFooter } from "../../layout/admin/AdminFooter";
import { TrendingUp, Users, GraduationCap, Calendar, CreditCard } from "lucide-react";
import { useAdminDashboardStats } from "../../hooks/admin/use-admin-finance-management";
import { useState, useMemo } from "react";
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

export default function AdminDashboard() {
  const [year] = useState(new Date().getFullYear());
  const { data: stats } = useAdminDashboardStats(year);

  const formattedFinancialData = useMemo(() => {
    if (!stats?.financialStats) return [];
    return MONTHS.map((month, index) => {
        const monthStr = `${year}-${String(index + 1).padStart(2, '0')}`;
        const monthData = stats.financialStats.find((s: { month: string; totalRevenue?: number }) => s.month === monthStr);
        return {
            name: month,
            revenue: monthData?.totalRevenue || 0
        };
    });
  }, [stats, year]);

  const cards = [
    { label: "Total Revenue", val: stats?.statsCards?.totalRevenue || 0, icon: TrendingUp, isCurrency: true },
    { label: "Total Users", val: stats?.statsCards?.totalUsers || 0, icon: Users },
    { label: "Total Trainers", val: stats?.statsCards?.totalTrainers || 0, icon: GraduationCap },
    { label: "Active Subscriptions", val: stats?.statsCards?.totalSubscriptions || 0, icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-[#050a05] text-white flex">
      <AdminSidebar />
      
      <main className="flex-1 ml-64 flex flex-col">
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-[#050a05]/80 backdrop-blur-md z-40">
           <div className="flex gap-8 items-center">
          
           </div>
        </header>

        <div className="p-10 flex-1">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-black italic uppercase tracking-tighter">Dashboard</h2>
              <p className="text-gray-500 text-xs italic mt-2 font-medium">Welcome back to your AI fitness admin panel.</p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 font-bold italic">
               <Calendar size={14} className="text-[#00ff94]" /> {year}  Year
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {cards.map((stat, index) => (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#0a1810] border border-white/5 p-6 rounded-2xl hover:border-[#00ff94]/20 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-[#00ff94]/10 rounded-xl flex items-center justify-center text-[#00ff94] group-hover:scale-110 transition-transform">
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[#00ff94] text-[10px] font-black uppercase italic">Live Stats</span>
                </div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 italic leading-none">{stat.label}</p>
                <h3 className="text-2xl font-black italic tracking-tighter">
                  {stat.isCurrency ? '₹' : ''}{(stat.val || 0).toLocaleString()}
                </h3>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Income Chart */}
             <div className="lg:col-span-2 bg-[#0a1810] border border-white/5 rounded-[2.5rem] p-8 h-[400px] relative overflow-hidden">
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <h4 className="text-sm font-bold uppercase italic tracking-widest text-white mb-1">Income Analytics</h4>
                        <p className="text-[10px] text-gray-500 font-medium italic">Monthly revenue performance.</p>
                    </div>
                </div>

                <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={formattedFinancialData}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#00ff94" stopOpacity={0.2}/>
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
                                fill="url(#colorRevenue)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
             </div>

             {/* User Distribution */}
             <div className="bg-[#0a1810] border border-white/5 rounded-[2.5rem] p-8 flex flex-col h-[400px]">
                <h4 className="text-sm font-bold uppercase italic tracking-widest text-white mb-2">User Distribution</h4>
                <p className="text-[10px] text-gray-500 font-medium italic mb-10">Client vs Trainer ecosystem balance.</p>
                
                <div className="flex-1 space-y-10">
                   <ProgressItem 
                        label="Clients" 
                        value={stats?.statsCards?.totalUsers || 0} 
                        total={ (stats?.statsCards?.totalUsers || 0) + (stats?.statsCards?.totalTrainers || 0) } 
                        color="#00ff94" 
                   />
                   <ProgressItem 
                        label="Trainers" 
                        value={stats?.statsCards?.totalTrainers || 0} 
                        total={ (stats?.statsCards?.totalUsers || 0) + (stats?.statsCards?.totalTrainers || 0) } 
                        color="#6366f1" 
                   />
                </div>
             </div>
          </div>
        </div>

        <AdminFooter />
      </main>
    </div>
  );
}

interface ProgressItemProps {
    label: string;
    value: number;
    total: number;
    color: string;
}

const ProgressItem = ({ label, value, total, color }: ProgressItemProps) => {
    const percentage = total > 0 ? (value / total) * 100 : 0;
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-end px-1">
                <span className="text-xs font-bold text-white uppercase italic">{label}</span>
                <span className="text-sm font-black italic" style={{ color }}>{value.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full rounded-full shadow-lg shadow-current"
                    style={{ backgroundColor: color }}
                />
            </div>
        </div>
    );
};

interface TooltipPayloadItem {
    value: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-[#050a05]/90 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-2xl">
                <p className="text-[10px] font-black text-gray-500 uppercase italic mb-2 tracking-widest">{label}</p>
                <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00ff94]" />
                        <span className="text-[10px] font-bold text-white uppercase italic">Revenue</span>
                    </div>
                    <span className="text-xs font-black italic text-white">₹{payload[0].value.toLocaleString()}</span>
                </div>
            </div>
        );
    }
    return null;
};