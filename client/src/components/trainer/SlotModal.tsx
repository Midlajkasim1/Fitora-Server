import { useEffect, useState } from "react";
import { useForm, useWatch, type Resolver, type SubmitHandler } from "react-hook-form";
import { X, Clock } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";

import { useCreateSlot } from "../../hooks/trainer/slot/use-create-slot";
import { useEditSlot } from "../../hooks/trainer/slot/use-edit-slots";
import { CreateSlotSchema, type CreateSlotFormData } from "../../validators/trainer/Slot.validator";
import { combineToISO, getTodayDate } from "./DateHelper";
import { TimePicker12h } from "./TimePicker";
import type { UpcomingSlot } from "../../type/trainer.types";

interface SlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UpcomingSlot | null;
}

export const CreateSlotModal = ({ isOpen, onClose, initialData }: SlotModalProps) => {
  const { mutate: createMutate, isPending: isCreating } = useCreateSlot();
  const { mutate: editMutate, isPending: isEditing } = useEditSlot();

  // ── Derive period from initialData during render (React "getDerivedStateFromProps" pattern) ──
  // Tracking the last-seen snapshot lets us compute period when props change
  // without calling setState inside a useEffect (which causes cascading renders).
  const [period, setPeriod] = useState<"AM" | "PM">("AM");
  const [prevSnapshot, setPrevSnapshot] = useState<{ data: typeof initialData; open: boolean }>({
    data: initialData,
    open: isOpen,
  });

  if (prevSnapshot.data !== initialData || prevSnapshot.open !== isOpen) {
    setPrevSnapshot({ data: initialData, open: isOpen });
    if (initialData && isOpen) {
      const hours = new Date(initialData.startTime).getHours();
      setPeriod(hours >= 12 ? "PM" : "AM");
    } else if (!initialData && isOpen) {
      setPeriod("AM");
    }
  }

  const isEditMode = !!initialData;

  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<CreateSlotFormData>({
    resolver: zodResolver(CreateSlotSchema) as Resolver<CreateSlotFormData>,
  });

  const sessionType = useWatch({ control, name: "type" });
  const selectedTime = useWatch({ control, name: "time" });

  // Only call reset() here — react-hook-form imperative, not a React setState
  useEffect(() => {
    if (initialData && isOpen) {
      const start = new Date(initialData.startTime);
      let hours = start.getHours();
      hours = hours % 12 || 12;
      const timeStr = `${String(hours).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
      reset({
        type: initialData.type,
        capacity: initialData.capacity,
        date: new Date(initialData.startTime).toISOString().split("T")[0],
        time: timeStr,
      });
    } else if (!initialData && isOpen) {
      reset({ type: 'one_on_one', capacity: 1, date: getTodayDate(), time: "10:00" });
    }
  }, [initialData, isOpen, reset]);

  const onSubmit: SubmitHandler<CreateSlotFormData> = (formData) => {
    const startISO = combineToISO(formData.date, formData.time, period);
    const startDate = new Date(startISO);

    if (startDate < new Date() && !isEditMode) {
      toast.dismiss();
      return toast.error("Session must be in the future");
    }

    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000).toISOString();

    const payload = {
      type: formData.type,
      capacity: Number(formData.capacity),
      startTime: startISO,
      endTime: endDate,
    };

    if (isEditMode && initialData) {
      editMutate({ ...payload, slotId: initialData.slotId }, { onSuccess: onClose });
    } else {
      createMutate(payload, { onSuccess: onClose });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-white">
      <div className="bg-[#0d1f17] border border-white/5 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-white font-bold text-xl italic uppercase tracking-tighter">
            {isEditMode ? "Edit Session" : "New Session"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors p-1">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Type Selection */}
          <div className="grid grid-cols-2 gap-3 bg-black/40 p-1.5 rounded-2xl border border-white/5">
            {[
              { id: 'one_on_one', label: 'Personal' },
              { id: 'group', label: 'Group' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  setValue('type', t.id as 'one_on_one' | 'group');
                  if (t.id === 'one_on_one') setValue('capacity', 1);
                }}
                className={`py-2.5 rounded-xl text-[10px] font-black uppercase italic transition-all ${
                  sessionType === t.id 
                    ? "bg-[#00ff94] text-black shadow-[0_0_15px_rgba(0,255,148,0.4)]" 
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Date & Time */}
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-gray-500 uppercase italic ml-1">Session Date</label>
              <input 
                type="date" 
                {...register("date")} 
                min={getTodayDate()} 
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm outline-none focus:border-[#00ff94] transition-all" 
              />
            </div>
            <TimePicker12h register={register} name="time" period={period} setPeriod={setPeriod} />
          </div>

          {/* Capacity */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-gray-500 uppercase italic ml-1">Capacity</label>
            <div className="relative">
              <input 
                type="number" 
                disabled={sessionType === 'one_on_one'}
                {...register("capacity", { valueAsNumber: true })}
                className={`w-full bg-white/5 border rounded-xl p-3 text-white text-sm focus:border-[#00ff94] outline-none transition-all ${
                  errors.capacity ? "border-red-500" : "border-white/10"
                } disabled:opacity-20`}
              />
              {sessionType === 'one_on_one' && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-gray-600 font-bold uppercase italic">Fixed</span>
              )}
            </div>
            {errors.capacity && <p className="text-red-500 text-[10px] italic mt-1 font-bold">{errors.capacity.message}</p>}
          </div>

          {/* Preview Badge */}
          <div className="bg-[#00ff94]/5 border border-[#00ff94]/10 rounded-2xl p-4 flex items-center gap-3">
            <Clock size={16} className="text-[#00ff94]" />
            <span className="text-[10px] font-bold uppercase italic tracking-wider text-[#00ff94]">
              {selectedTime} {period} (1 Hour Session)
            </span>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            disabled={isCreating || isEditing} 
            className="w-full bg-[#00ff94] text-black font-black py-4 rounded-xl uppercase italic text-xs hover:bg-[#00e685] transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(0,255,148,0.2)] active:scale-95"
          >
            {isCreating || isEditing ? "Syncing..." : isEditMode ? "Update Slot" : "Confirm & Create Slot"}
          </button>
        </form>
      </div>
    </div>
  );
};