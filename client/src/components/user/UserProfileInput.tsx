import React from "react";
import { ChevronDown } from "lucide-react";

interface SelectOption {
  label: string;
  value: string;
}

interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value?: string;
  isEditing: boolean;
  options?: SelectOption[];
  onChange?: (val: string) => void;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
  icon,
  label,
  value,
  isEditing,
  options,
  onChange
}) => {
  return (
    <div className="group">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-[#00ff94]/40 group-focus-within:text-[#00ff94] transition-colors">
          {icon}
        </div>
        <span className="text-gray-500 text-[9px] font-black uppercase italic tracking-widest">
          {label}
        </span>
      </div>

      {!isEditing ? (
        <div className="w-full bg-[#0d1f17] border border-white/5 px-6 py-4 rounded-2xl text-white font-bold italic text-sm">
          {value || "-"}
        </div>
      ) : options ? (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-full bg-[#0d1f17] border border-white/5 px-6 py-4 rounded-2xl text-white font-bold italic text-sm appearance-none outline-none focus:border-[#00ff94]/30 transition-all"
          >
            {!value && <option value="">Select Specialization</option>}
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none w-4 h-4" />
        </div>
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="w-full bg-[#0d1f17] border border-white/5 px-6 py-4 rounded-2xl text-white font-bold italic text-sm outline-none focus:border-[#00ff94]/30 transition-all"
        />
      )}
    </div>
  );
};