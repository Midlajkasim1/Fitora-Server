import React from 'react';
import { ActivityIcon } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6 border-t border-white/5 bg-[#0a1810]">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Branding */}
        <div className="flex items-center gap-2">
          <ActivityIcon className="w-6 h-6 text-[#00ff94]" />
          <span className="text-white font-bold text-xl tracking-tight italic">Fitora</span>
        </div>

        {/* Links - Responsive gap and centering */}
        <nav className="flex flex-wrap justify-center gap-6 md:gap-10 text-sm font-medium text-gray-400">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Support</a>
        </nav>

        {/* Copyright */}
        <p className="text-gray-600 text-xs md:text-sm text-center">
          © 2026 AI Fitness Inc. All rights reserved.
        </p>
      </div>
    </footer>
  );
};