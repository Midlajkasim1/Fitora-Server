import { AdminLayout } from "../../layout/admin/AdminLayout";
import { useCreateSpecialization } from "../../hooks/admin/use-create-specialization";
import { useNavigate } from "react-router-dom";
import { Save } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    specializationSchema,
} from "../../validators/admin/Specialization.Schema";
import type { SpecializationFormData } from "../../validators/admin/Specialization.Schema"
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CreateSpecialization() {
    const navigate = useNavigate();
    const createMutation = useCreateSpecialization();
    const [preview, setPreview] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<SpecializationFormData>({
        resolver: zodResolver(specializationSchema),
    });

const onSubmit = (data: SpecializationFormData) => {
  navigate("/admin/specializations");
 toast.success("Specialization created successfully")
  createMutation.mutate({
    name: data.name,
    description: data.description,
    image: data.image,
  });
};
useEffect(() => {
  register("image");
}, [register]);
    return (
        <AdminLayout>
            <div className="p-10 flex justify-center">
                <div className="w-full max-w-3xl bg-[#0d1f17] border border-white/10 rounded-2xl p-10 shadow-xl">

                    <h2 className="text-3xl font-black text-white mb-8">
                        Add New Specialisation
                    </h2>

                    <form onSubmit={handleSubmit(onSubmit)}>

                        {/* NAME */}
                        <div className="mb-6">
                            <label className="text-sm text-gray-400">
                                Specialisation Name
                            </label>

                            <input
                                {...register("name")}
                                type="text"
                                placeholder="e.g., HIIT, Yoga"
                                className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#00ff94]/50"
                            />

                            {errors.name && (
                                <p className="text-red-500 text-[10px] mt-1 italic font-bold">
                                    {errors.name.message}
                                </p>
                            )}
                        </div>

                        {/* DESCRIPTION */}
                        <div className="mb-6">
                            <label className="text-sm text-gray-400">Description</label>

                            <textarea
                                {...register("description")}
                                rows={4}
                                placeholder="Enter description..."
                                className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white outline-none focus:border-[#00ff94]/50"
                            />

                            {errors.description && (
                                <p className="text-red-500 text-[10px] mt-1 italic font-bold">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        {/* IMAGE */}
                        <div className="mb-8">
                            <label className="text-sm text-gray-400">Image</label>

                            <div className="mt-3 border-2 border-dashed border-white/20 rounded-2xl p-10 text-center relative hover:border-[#00ff94]/40 transition">
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setValue("image", file, { shouldValidate: true });
                                        setPreview(URL.createObjectURL(file));
                                    }}
                                />

                                {preview ? (
                                    <img
                                        src={preview}
                                        alt="preview"
                                        className="mx-auto h-40 object-contain"
                                    />
                                ) : (
                                    <p className="text-gray-400">
                                        Click to upload or drag and drop <br />
                                        JPG or PNG (MAX. 5MB)
                                    </p>
                                )}
                            </div>

                            {errors.image && (
                                <p className="text-red-500 text-[10px] mt-1 italic font-bold">
                                    {errors.image.message as string}
                                </p>
                            )}
                        </div>

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-4">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/specializations")}
                                className="px-6 py-3 border border-white/10 rounded-xl text-gray-300 hover:bg-white/5"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={createMutation.isPending}
                                className="flex items-center gap-2 bg-[#00ff94] text-black px-6 py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-50"
                            >
                                <Save size={18} />
                                {createMutation.isPending
                                    ? "Saving..."
                                    : "Save Specialisation"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}