import { AdminLayout } from "../../layout/admin/AdminLayout";
import { useUpdateSpecialization } from "../../hooks/admin/use-update-specialization";
import { useNavigate, useParams } from "react-router-dom";
import { Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { EditSpecializationFormData } from "../../validators/admin/EditSpecialization.Schema";
import { useEffect } from "react";
import { useSpecializationById } from "../../hooks/admin/use-specializationById";
import toast from "react-hot-toast";
import { editSpecializationSchema } from "../../validators/admin/EditSpecialization.Schema";

export default function EditSpecialization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateMutation = useUpdateSpecialization();
  const { data, isLoading } = useSpecializationById(id!);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditSpecializationFormData>({
    resolver: zodResolver(editSpecializationSchema),
  });

  // Prefill form
  useEffect(() => {
    if (!data) return;

    reset({
      name: data.name,
      description: data.description,
    });
  }, [data, reset]);


  const onSubmit = (formData: EditSpecializationFormData) => {
    updateMutation.mutate(
      {
        id: id!,
        name: formData.name,
        description: formData.description,
        image: formData.image,
      },
      {
        onSuccess: () => {
          toast.success("Specialization updated");
          navigate("/admin/specializations");
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message || "Update failed");
        },
      }
    );
  };


  return (
    <AdminLayout>
      <div className="p-10 flex justify-center">
        <div className="w-full max-w-3xl bg-[#0d1f17] border border-white/10 rounded-2xl p-10 shadow-xl">

          <h2 className="text-3xl font-black text-white mb-8">
            Edit Specialisation
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
                className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white"
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
                className="w-full mt-2 bg-black/20 border border-white/10 rounded-xl py-3 px-4 text-white"
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

              <div className="mt-3 border-2 border-dashed border-white/20 rounded-2xl p-10 text-center relative">
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

                {data?.imageUrl ? (
                  <img
                    src={data.imageUrl}
                    alt="preview"
                    className="mx-auto h-40 object-contain"
                  />
                ) : (
                  <p className="text-gray-400">
                    Click to upload image
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
                className="px-6 py-3 border border-white/10 rounded-xl text-gray-300"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex items-center gap-2 bg-[#00ff94] text-black px-6 py-3 rounded-xl font-bold"
              >
                <Save size={18} />
                {updateMutation.isPending ? "Updating..." : "Update"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </AdminLayout>
  );
}