import { AdminSidebar } from "../../layout/admin/AdminSideBar";
import { AdminFooter } from "../../layout/admin/AdminFooter";
import { TrendingUp, Users, GraduationCap, Grid, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { AllUserCount } from "../../api/admin.api";

export default function AdminDashboard() {
  const [count,setCount]=useState(0);

  useEffect(()=>{
    const handleuserCount = async ()=>{
      const res = await AllUserCount();

      const count = res.data?.allUser
      setCount(count | 0);
    }
   handleuserCount()
  },[])
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
            <button className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg flex items-center gap-2 text-xs text-gray-400">
               <Calendar size={14} /> This Month
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Total Revenue", val: "3555", change: "12%", icon: TrendingUp },
              { label: "Total Users", val:count, change: "5%", icon: Users },
              { label: "Total Trainers", val: "551", change: "3%", icon: GraduationCap },
              { label: "Total Specialization", val: "15", change: "1%", icon: Grid },
            ].map((stat) => (
              <div key={stat.label} className="bg-[#0a1810] border border-white/5 p-6 rounded-2xl hover:border-[#00ff94]/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-[#00ff94]/10 rounded-xl flex items-center justify-center text-[#00ff94]">
                    <stat.icon size={20} />
                  </div>
                  <span className="text-[#00ff94] text-[10px] font-bold flex items-center gap-1">
                    <TrendingUp size={10} /> {stat.change}
                  </span>
                </div>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-1 italic">{stat.label}</p>
                <h3 className="text-xl font-black italic">{stat.val}</h3>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-[#0a1810] border border-white/5 rounded-[2rem] p-8 h-96">
                <h4 className="text-sm font-bold uppercase italic tracking-widest text-white mb-8">Income & Expense Yearly</h4>
                <div className="h-full w-full flex items-center justify-center border-t border-white/5 italic text-gray-700"> Yearly Analytics Visual </div>
             </div>
             <div className="bg-[#0a1810] border border-white/5 rounded-[2rem] p-8 h-96">
                <h4 className="text-sm font-bold uppercase italic tracking-widest text-white mb-8">Total Users progress</h4>
                <div className="h-full w-full border-t border-white/5 p-4 space-y-8">
                   <div>
                      <div className="flex justify-between text-[10px] font-bold uppercase italic mb-2"><span>Users</span><span>100k</span></div>
                      <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden"><div className="w-full h-full bg-[#00ff94]" /></div>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <AdminFooter />
      </main>
    </div>
  );
}