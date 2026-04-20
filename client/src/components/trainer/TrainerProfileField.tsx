import type { UseFormRegister } from "react-hook-form";

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
        <div className="space-y-2 group">
            <div className="flex items-center gap-2 mb-1">
                <span className="text-[#00ff94] opacity-70 group-hover:opacity-100 transition-opacity">
                    {icon}
                </span>
                <label className="text-[10px] font-black uppercase italic text-gray-500 tracking-widest">
                    {label}
                </label>
            </div>

            {isEditing ? (
                <div className="relative">
                    <input
                        {...register(name)}
                        className={`w-full bg-[#0d1f17] border ${error ? "border-red-500" : "border-white/10"
                            } p-4 rounded-2xl text-sm font-bold text-white outline-none focus:border-[#00ff94] transition-all`}
                    />
                    {error && <p className="text-red-500 text-[9px] mt-1 font-bold italic uppercase">{error}</p>}
                </div>
            ) : (
                <div className="p-4 bg-white/5 border border-transparent rounded-2xl">
                    <p className="text-sm font-black italic uppercase tracking-tight text-white/90">
                        {value || "Not Set"}
                    </p>
                </div>
            )}
        </div>
    );
};