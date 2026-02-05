import { Search, ChevronDown } from "lucide-react";

interface FilterOption {
  label: string;
  value: string;
}

interface ManagementHeaderProps {
  placeholder: string;
  filters: {
    label: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  onSearch: (query: string) => void;
}

export const ManagementHeader = ({ placeholder, filters, onSearch }: ManagementHeaderProps) => {
  return (
    <div className="bg-[#0a1810] border border-white/5 p-4 rounded-2xl flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[300px] relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input
          type="text"
          placeholder={placeholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm text-white outline-none focus:border-[#00ff94]/50 transition-all"
        />
      </div>

      {filters.map((filter, index) => (
        <div key={index} className="relative group">
          <select 
            onChange={(e) => filter.onChange(e.target.value)}
            className="appearance-none bg-black/20 border border-white/10 rounded-xl py-3 px-6 pr-12 text-sm text-gray-300 outline-none focus:border-[#00ff94]/50 cursor-pointer transition-all"
          >
            <option value="">{filter.label}</option>
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
        </div>
      ))}
    </div>
  );
};