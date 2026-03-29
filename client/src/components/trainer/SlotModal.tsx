import { useState } from "react";
import { X, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { useCreateSlot } from "../../hooks/trainer/use-create-slot";
import { combineToISO, getTodayDate } from "./DateHelper";
import { TimePicker12h } from "./timePicker";


export const CreateSlotModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { mutate, isPending } = useCreateSlot();
  const [period, setPeriod] = useState<"AM" | "PM">("AM");

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: { 
      type: 'one_on_one', 
      capacity: 1,
      date: getTodayDate(),
      time: "10:00",
    }
  });

  const sessionType = watch("type");
  const selectedTime = watch("time");

  const onSubmit = (formData: any) => {
    const startISO = combineToISO(formData.date, formData.time, period);
    const startDate = new Date(startISO);
    
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

    const payload = {
      type: formData.type,
      capacity: formData.capacity,
      startTime: startISO,
      endTime: endDate.toISOString(),
    };

    mutate(payload, { 
        
      onSuccess: () => onClose(),
      
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0d1f17] border border-white/5 w-full max-w-md rounded-3xl p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-xl italic uppercase tracking-tighter">New Session</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            {['one_on_one', 'group'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  setValue('type', t as any);
                  if (t === 'one_on_one') setValue('capacity', 1);
                }}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                  sessionType === t ? "bg-[#00ff94] text-black" : "text-gray-500"
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Date & Time Picker Component */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase italic ml-1">Session Date</label>
              <input type="date" {...register("date")} min={getTodayDate()} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#00ff94] outline-none" />
            </div>

            <TimePicker12h register={register} period={period} setPeriod={setPeriod} />
          </div>

          {/* Capacity */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase italic ml-1">Capacity</label>
            <div className="relative">
              <input 
                type="number" 
                disabled={sessionType === 'one_on_one'}
                {...register("capacity", { valueAsNumber: true })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-[#00ff94] outline-none disabled:opacity-20"
              />
              {sessionType === 'one_on_one' && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-gray-600 font-bold uppercase italic">Fixed</span>}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-[#00ff94]/5 border border-[#00ff94]/10 rounded-2xl p-4">
            <div className="flex items-center gap-3 text-[#00ff94]">
              <Clock size={16} />
              <span className="text-[10px] font-bold uppercase italic tracking-wider">
                Slot: {selectedTime} {period} (1 Hour Session)
              </span>
            </div>
          </div>

          <button disabled={isPending} className="w-full bg-[#00ff94] text-black font-black py-4 rounded-xl uppercase italic text-xs hover:bg-[#00e685] transition-all disabled:opacity-50">
            {isPending ? "Syncing..." : "Confirm & Create Slot"}
          </button>
        </form>
      </div>
    </div>
  );
};