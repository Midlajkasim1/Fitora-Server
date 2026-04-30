import { Link } from "react-router-dom";

export const UserFooter = () => {
  return (
    <footer className="bg-[#0a1810] border-t border-white/5 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <span className="font-black italic uppercase text-2xl text-white">AI Fitness</span>
            <p className="text-gray-500 text-sm mt-4 italic max-w-xs leading-relaxed">
              Transforming lives through artificial intelligence and personalized fitness engineering.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#00ff94] text-[10px] font-black uppercase tracking-widest italic mb-2">Platform</h4>
            <Link to="/home" className="text-gray-500 hover:text-white text-xs font-bold uppercase italic transition-colors">Dashboard</Link>
            <Link to="/workouts" className="text-gray-500 hover:text-white text-xs font-bold uppercase italic transition-colors">Workouts</Link>
            <Link to="/support" className="text-gray-500 hover:text-white text-xs font-bold uppercase italic transition-colors">Support Center</Link>
          </div>

          {/* Support Links */}
          <div className="flex flex-col gap-4">
            <h4 className="text-[#00ff94] text-[10px] font-black uppercase tracking-widest italic mb-2">Legal</h4>
            <Link to="/privacy" className="text-gray-500 hover:text-white text-xs font-bold uppercase italic transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-xs font-bold uppercase italic transition-colors">Terms of Service</Link>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-700 text-[9px] font-bold uppercase tracking-widest italic">
            © 2026 AI Fitness Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {/* Social Icons Placeholder */}
            <div className="w-4 h-4 bg-gray-800 rounded-sm" />
            <div className="w-4 h-4 bg-gray-800 rounded-sm" />
            <div className="w-4 h-4 bg-gray-800 rounded-sm" />
          </div>
        </div>
      </div>
    </footer>
  );
};