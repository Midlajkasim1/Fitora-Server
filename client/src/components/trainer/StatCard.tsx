// components/trainer/StatCard.tsx
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  percentage: string;
}

const StatCard = ({ title, value, icon, percentage }: StatCardProps) => (
  <div className="bg-[#0f241d] p-6 rounded-2xl border border-emerald-900/20 relative shadow-lg">
    {/* Icon Container */}
    <div className="bg-emerald-950/50 w-12 h-12 rounded-xl flex items-center justify-center mb-4">
      {icon}
    </div>

    {/* Percentage Badge */}
    <div className="absolute top-6 right-6 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded text-xs flex items-center gap-1 font-medium">
       {percentage}
    </div>

    {/* Label - Keep slightly gray for hierarchy */}
    <p className="text-gray-400 text-sm font-medium">{title}</p>

    {/* Main Data Value - Now Pure White */}
    <h3 className="text-3xl font-bold mt-1 text-white">
      {value}
    </h3>

    {/* Subtext */}
    <p className="text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-wider">
      Up from yesterday
    </p>
  </div>
);

export default StatCard;