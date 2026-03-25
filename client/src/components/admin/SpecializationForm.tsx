import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { specializationSchema, type SpecializationFormData } from "../../validators/admin/Specialization.Schema";

interface Props {
  mode: "create" | "edit";
  initialData?: {
    name: string;
    description: string;
    imageUrl?: string;
  };
  onSubmit: (data: SpecializationFormData) => void;
  isPending: boolean;
}

export default function SpecializationForm({ mode, initialData, onSubmit, isPending }: Props) {
  const navigate = useNavigate();
  
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SpecializationFormData>({
    resolver: zodResolver(specializationSchema),
    values: {
      mode: mode, 
      name: initialData?.name || "",
      description: initialData?.description || "",
      image: undefined,
    },
  });


  const preview = localFileUrl || initialData?.imageUrl || null;

  useEffect(() => {
    return () => {
      if (localFileUrl) URL.revokeObjectURL(localFileUrl);
    };
  }, [localFileUrl]);

  useEffect(() => {
    register("image");
  }, [register]);

  return (
    <AdminLayout>
      <div className="p-10 flex justify-center">
        <div className="w-full max-w-3xl bg-[#0d1f17] border border-white/10 rounded-2xl p-10 shadow-xl">
          <h2 className="text-3xl font-black text-white mb-8 italic uppercase tracking-tighter">
            {mode === "create" ? "Add Specialisation" : "Edit Specialisation"}
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* NAME */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                Specialisation Name
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="e.g., HIIT, Yoga"
                className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-[#00ff94]/50 transition-all font-bold italic"
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] mt-2 italic font-bold uppercase">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                Description
              </label>
              <textarea
                {...register("description")}
                rows={4}
                placeholder="Describe the training style..."
                className="w-full mt-2 bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-[#00ff94]/50 transition-all font-bold italic"
              />
              {errors.description && (
                <p className="text-red-500 text-[10px] mt-2 italic font-bold uppercase">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* IMAGE UPLOAD */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">
                Cover Image
              </label>
              <div className="mt-3 border-2 border-dashed border-white/10 rounded-2xl p-8 text-center relative hover:border-[#00ff94]/30 transition-all group overflow-hidden">
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    setValue("image", file, { shouldValidate: true });
                    
                    if (localFileUrl) URL.revokeObjectURL(localFileUrl);
                    
                    setLocalFileUrl(URL.createObjectURL(file));
                  }}
                />
                
                {preview ? (
                  <div className="relative">
                    <img 
                      src={preview} 
                      alt="preview" 
                      className="mx-auto h-48 w-full object-cover rounded-lg shadow-2xl" 
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-[#00ff94] text-[10px] font-bold uppercase italic tracking-widest">
                        Change Image
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="py-4">
                    <p className="text-gray-500 text-xs font-bold uppercase italic">
                      Click to upload brand assets
                    </p>
                    <p className="text-[9px] text-gray-700 mt-1 uppercase">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-500 text-[10px] mt-2 italic font-bold uppercase">
                  {errors.image.message as string}
                </p>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/admin/specializations")}
                className="px-8 py-4 border border-white/5 rounded-xl text-gray-500 text-xs font-bold uppercase italic hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 bg-[#00ff94] text-black px-8 py-4 rounded-xl font-black uppercase italic text-xs tracking-widest hover:shadow-[0_0_30px_rgba(0,255,148,0.2)] disabled:opacity-50 transition-all"
              >
                <Save size={16} />
                {isPending ? "Processing..." : mode === "create" ? "Create Plan" : "Update Plan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}