// components/admin/AdvertisementForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ImagePlus, X, Megaphone } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { advertisementSchema, type AdvertisementFormData } from "../../validators/admin/Advertisement.Schema";

interface Props {
    mode: "create" | "edit";
    initialData?: any;
    onSubmit: (data: FormData) => void;
    isPending: boolean;
}

export default function AdvertisementForm({ mode, initialData, onSubmit, isPending }: Props) {
    const navigate = useNavigate();

    const [previews, setPreviews] = useState<string[]>(initialData?.bannerImages || []);
    const [filesArray, setFilesArray] = useState<File[]>([]);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<AdvertisementFormData>({
        resolver: zodResolver(advertisementSchema),
        defaultValues: {
            brandName: initialData?.brandName || "",
            startDate: initialData?.startDate
                ? new Date(initialData.startDate).toISOString().split("T")[0]
                : "",

            expiryDate: initialData?.expiryDate
                ? new Date(initialData.expiryDate).toISOString().split("T")[0]
                : "",
            brandLink: initialData?.brandLink || "",
            description: initialData?.description || "",
            bannerImages: initialData?.bannerImages ? [true] : [],
        },
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newFiles = Array.from(e.target.files || []);
        if (newFiles.length === 0) return;

        const updatedFiles = [...filesArray, ...newFiles].slice(0, 5);
        setFilesArray(updatedFiles);

        setValue("bannerImages", updatedFiles, { shouldValidate: true });

        const newPreviews = updatedFiles.map((file) => URL.createObjectURL(file));
        const remoteImages = initialData?.bannerImages || [];
        setPreviews([...remoteImages, ...newPreviews].slice(0, 5));
    };

    const removeImage = (index: number) => {
        const updatedPreviews = previews.filter((_, i) => i !== index);
        const updatedFiles = filesArray.filter((_, i) => i !== (index - (initialData?.bannerImages?.length || 0)));

        setPreviews(updatedPreviews);
        setFilesArray(updatedFiles);
        setValue("bannerImages", updatedFiles.length > 0 || updatedPreviews.length > 0 ? [true] : [] as any);
    };

    const onInternalSubmit = (data: AdvertisementFormData) => {
        const formData = new FormData();
        formData.append("brandName", data.brandName);
        formData.append("startDate", data.startDate);
        formData.append("expiryDate", data.expiryDate);
        formData.append("brandLink", data.brandLink);
        if (data.description) formData.append("description", data.description);

        filesArray.forEach((file) => {
            formData.append("bannerImages", file);
        });

        onSubmit(formData);
    };

    const labelClass = "text-[10px] font-black uppercase tracking-widest text-gray-500 italic";
    const inputClass = "w-full mt-2 bg-black/40 border border-white/10 rounded-xl py-4 px-4 text-white outline-none focus:border-[#00ff94]/50 transition-all font-bold italic text-sm";

    return (
        <AdminLayout>
            <div className="p-10 flex justify-center">
                <div className="w-full max-w-4xl bg-[#0d1f17] border border-white/10 rounded-2xl p-10 shadow-xl">
                    <header className="flex items-center gap-3 mb-8">
                        <Megaphone className="text-[#00ff94]" size={28} />
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                            {mode === "create" ? "Launch Campaign" : "Edit Campaign"}
                        </h2>
                    </header>

                    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-6">
                        <div>
                            <label className={labelClass}>Brand Name</label>
                            <input {...register("brandName")} type="text" className={inputClass} placeholder="e.g. FitPro Supplement Promo" />
                            {errors.brandName && <p className="text-red-500 text-[10px] mt-2 italic font-bold uppercase">{errors.brandName.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Start Date</label>
                                <input {...register("startDate")} type="date" className={inputClass} />
                                {errors.startDate && <p className="text-red-500 text-[10px] mt-2 italic font-bold uppercase">{errors.startDate.message}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Expiry Date</label>
                                <input {...register("expiryDate")} type="date" className={inputClass} />
                                {errors.expiryDate && <p className="text-red-500 text-[10px] mt-2 italic font-bold uppercase">{errors.expiryDate.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className={labelClass}>Destination URL</label>
                            <input {...register("brandLink")} type="text" className={inputClass} placeholder="https://brand.com" />
                            {errors.brandLink && <p className="text-red-500 text-[10px] mt-2 italic font-bold uppercase">{errors.brandLink.message}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Creative Assets (Max 5)</label>
                            <div className="mt-3 border-2 border-dashed border-white/10 rounded-2xl p-6 bg-black/20">
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {previews.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-white/10 group">
                                            <img src={url} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-20">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}

                                    {previews.length < 5 && (
                                        <div className="relative aspect-square border border-dashed border-[#00ff94]/30 rounded-xl flex flex-col items-center justify-center text-[#00ff94] bg-[#00ff94]/5 hover:bg-[#00ff94]/10 transition-all">
                                            <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleFileChange} />
                                            <ImagePlus size={20} />
                                            <span className="text-[8px] font-bold uppercase mt-2">Add More</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            {errors.bannerImages && <p className="text-red-500 text-[10px] mt-2 italic font-bold uppercase">{errors.bannerImages.message as string}</p>}
                        </div>

                        <div>
                            <label className={labelClass}>Description</label>
                            <textarea {...register("description")} rows={3} className={`${inputClass} resize-none`} placeholder="Optional campaign text..." />
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                            <button type="button" onClick={() => navigate("/admin/advertisements")} className="px-8 py-4 text-gray-500 text-xs font-bold uppercase italic hover:text-white transition-colors">Discard</button>
                            <button disabled={isPending} type="submit" className="flex items-center gap-2 bg-[#00ff94] text-black px-10 py-4 rounded-xl font-black uppercase italic text-xs tracking-widest hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] disabled:opacity-50 transition-all">
                                <Save size={16} />
                                {isPending ? "Saving..." : mode === "create" ? "Create Ad" : "Update Ad"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}