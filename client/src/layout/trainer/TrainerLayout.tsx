import { Outlet } from "react-router-dom";
import { PageMeta } from "../../shared/PageMeta";
import Sidebar from "./SideBar";

const TrainerLayout = () => {
  return (
    <div className="flex bg-[#06110d] min-h-screen font-sans">
      <PageMeta 
        title="Trainer Dashboard | Fitora" 
        favicon="/favicon.svg" 
      />
      
      {/* 1. Fixed Sidebar (Width is 64 / 16rem) */}
      <Sidebar />

      {/* 2. Main Content - Added ml-64 to push it past the fixed sidebar */}
      <div className="flex-1 ml-64 flex flex-col h-screen overflow-hidden">
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {/* Added p-8 so content isn't touching the very top/edges */}
          <div className="max-w-[1400px] mx-auto p-8">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrainerLayout;