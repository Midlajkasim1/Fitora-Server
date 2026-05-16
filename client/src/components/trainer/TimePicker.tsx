// components/trainer/TimePicker12h.tsx
import type { UseFormRegister, FieldValues } from "react-hook-form";

interface TimePickerProps {
  register: UseFormRegister<any>;
  period: "AM" | "PM";
  setPeriod: (p: "AM" | "PM") => void;
}

export const TimePicker12h = ({ register, period, setPeriod }: TimePickerProps) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-gray-500 uppercase italic ml-1">
      Start Time (12h)
    </label>
    <div className="flex gap-2">
      <input 
        type="time" 
        {...register("time")}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#00ff94] outline-none transition-all [color-scheme:dark]"
      />
      <div className="flex bg-black/40 rounded-xl p-1 border border-white/10">
        {(["AM", "PM"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`px-3 rounded-lg text-[10px] font-black transition-all ${
              period === p ? "bg-white/10 text-[#00ff94]" : "text-gray-600"
            }`}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  </div>
);