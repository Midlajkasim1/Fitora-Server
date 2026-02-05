
import { AdminFooter } from "./AdminFooter";
import { AdminSidebar } from "./AdminSideBar";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#050a05] text-white flex">
      {/* 1. FIXED SIDEBAR */}
      <AdminSidebar />
      
      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* 3. TOP HEADER (Reusable) */}
        <header className="h-20 border-b border-white/5 px-10 flex items-center justify-between sticky top-0 bg-[#050a05]/80 backdrop-blur-md z-40">
       
        </header>

        {/* 4. DYNAMIC PAGE CONTENT */}
        <div className="flex-1">
          {children}
        </div>

        {/* 5. FOOTER */}
        <AdminFooter />
      </main>
    </div>
  );
};