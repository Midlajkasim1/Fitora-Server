import React from 'react';
import { Activity } from 'lucide-react';

interface DonutProgressProps {
  totalAttended: number;
  totalSubscriptionSessions: number;
  sessionsLeft: number;
}

export const DonutProgress = ({ 
  totalAttended, 
  totalSubscriptionSessions, 
  sessionsLeft 
}: DonutProgressProps) => {
  const usedSessions = totalSubscriptionSessions - sessionsLeft;
  const percentage = Math.min(Math.round((usedSessions / totalSubscriptionSessions) * 100), 100);
  
  return (
    <div className="bg-[#132a1e] border border-white/5 p-6 rounded-[2.5rem] h-full flex flex-col items-center justify-between">
      <div className="w-full flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#00ff94]/10 flex items-center justify-center text-[#00ff94]">
            <Activity size={16} />
          </div>
          <h3 className="font-bold uppercase italic tracking-tighter text-sm">Activity Overview</h3>
        </div>
      </div>

      <div className="relative w-36 h-36 flex items-center justify-center shrink-0 my-2">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="72"
            cy="72"
            r="60"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="10"
          />
          <circle
            cx="72"
            cy="72"
            r="60"
            fill="none"
            stroke="#00ff94"
            strokeWidth="10"
            strokeDasharray={376.99}
            strokeDashoffset={376.99 - (percentage / 100) * 376.99}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black italic text-[#00ff94]">{percentage}%</span>
          <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 mt-1">Completed</span>
        </div>
      </div>

      <div className="w-full flex justify-center mt-2">
        <div className="flex flex-col items-center">
            <span className="text-[10px] font-black italic text-white uppercase tracking-tight">
                {totalAttended} Sessions Attended
            </span>
        </div>
      </div>
    </div>
  );
};
