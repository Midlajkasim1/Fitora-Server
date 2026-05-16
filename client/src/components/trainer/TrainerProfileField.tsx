import type { UseFormRegister, FieldValues } from "react-hook-form";

interface TrainerProfileFieldProps {
    icon: React.ReactNode;
    label: string;
    value: string | number | undefined;
    isEditing: boolean;
    register: UseFormRegister<any>;
    name: string;
    error?: string;
}

export const TrainerProfileField = ({
    icon,
    label,
    value,
    isEditing,
    register,
    name,
    error,
}: TrainerProfileFieldProps) => {
    return (
        <div className="space-y-1.5 md:space-y-2 group">
            <div className="flex items-center gap-2 mb-0.5 md:mb-1 ml-1">
                <span className="text-[#00ff94] opacity-60 group-hover:opacity-100 transition-opacity scale-90 md:scale-100">
                    {icon}
                </span>
                <label className="text-[9px] md:text-[10px] font-black uppercase italic text-gray-600 md:text-gray-500 tracking-widest">
                    {label}
                </label>
            </div>

            {isEditing ? (
                <div className="relative">
                    <input
                        {...register(name)}
                        className={`w-full bg-[#0d1a16] border ${error ? "border-red-500" : "border-white/5"
                            } px-4 py-3 md:py-4 rounded-xl md:rounded-2xl text-xs md:text-sm font-bold text-white outline-none focus:border-[#00ff94]/50 transition-all shadow-inner`}
                    />
                    {error && <p className="text-red-500 text-[8px] md:text-[9px] mt-1 font-bold italic uppercase px-1">{error}</p>}
                </div>
            ) : (
                <div className="px-4 py-3 md:py-4 bg-white/[0.03] border border-white/5 rounded-xl md:rounded-2xl group-hover:border-white/10 transition-all">
                    <p className="text-xs md:text-sm font-black italic uppercase tracking-wider text-white/80">
                        {value || "Not Set"}
                    </p>
                </div>
            )}
        </div>
    );
};