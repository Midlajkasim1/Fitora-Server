import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, Save } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createWorkoutSchema, type CreateWorkoutFormData } from "../../validators/admin/workout.Schema";
import { AdminLayout } from "../../layout/admin/AdminLayout";

interface WorkoutInitialData extends Partial<CreateWorkoutFormData> {
    videoUrl?: string;
    thumbnailUrl?: string;
}

interface Props {
    mode: "create" | "edit";
    initialData?: WorkoutInitialData;
    specializations?: { _id: string; name: string; id?: string }[];
    onSubmit: (data: CreateWorkoutFormData) => void;
    isPending: boolean;
}

export default function WorkoutForm({ mode, initialData, specializations, onSubmit, isPending }: Props) {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setValue,
        control,
        formState: { errors },
    } = useForm<CreateWorkoutFormData>({
        resolver: zodResolver(createWorkoutSchema),
        defaultValues: initialData as Partial<CreateWorkoutFormData>,
    });

    const videoFile = useWatch({ control, name: "video" });
    const thumbnailFile = useWatch({ control, name: "thumbnail" });

    const videoPreview = useMemo(() => {
        if (videoFile instanceof File) return URL.createObjectURL(videoFile);
        return initialData?.videoUrl || null;
    }, [videoFile, initialData?.videoUrl]);

    const thumbnailPreview = useMemo(() => {
        if (thumbnailFile instanceof File) return URL.createObjectURL(thumbnailFile);
        return initialData?.thumbnailUrl || null;
    }, [thumbnailFile, initialData?.thumbnailUrl]);

    useEffect(() => {
        return () => {
            if (videoPreview?.startsWith("blob:")) URL.revokeObjectURL(videoPreview);
            if (thumbnailPreview?.startsWith("blob:")) URL.revokeObjectURL(thumbnailPreview);
        };
    }, [videoPreview, thumbnailPreview]);

    const onInvalid = (errors: Record<string, unknown>) => {
        console.error("Form Validation Errors:", errors);
        toast.error("Please fill all required fields correctly", { id: "val-error" });
    };

    return (
        <AdminLayout>
            <div className="p-10 space-y-10 max-w-6xl">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        {mode === "create" ? "Create Workout Session" : "Edit Workout Session"}
                    </h2>
                    <p className="text-gray-500 text-sm font-bold italic uppercase mt-2">
                        {mode === "create" ? "Publish new content" : "Update session details"}
                    </p>
                </div>

                <form 
                    onSubmit={handleSubmit(onSubmit, onInvalid)} 
                    className="bg-[#0a1810] border border-white/5 rounded-2xl p-8 space-y-8 shadow-2xl"
                >
                    <div className="space-y-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-2 block">Workout Title</label>
                            <input {...register("title")} className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-[#00ff94]/50 outline-none font-bold italic" />
                            {errors.title && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.title.message as string}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-2 block">Description</label>
                            <textarea {...register("description")} rows={4} className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-[#00ff94]/50 outline-none font-bold italic" />
                            {errors.description && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.description.message as string}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-2 block">Specialization</label>
                            <select {...register("specializationId")} className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-4 px-4 text-white font-bold italic">
                                <option value="">Select</option>
                                {specializations?.map((sp) => <option key={sp.id} value={sp.id}>{sp.name}</option>)}
                            </select>
                            {errors.specializationId && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.specializationId.message as string}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-2 block">Difficulty</label>
                            <select {...register("difficulty")} className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-4 px-4 text-white font-bold italic">
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            {errors.difficulty && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.difficulty.message as string}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-2 block">Duration</label>
                            <select {...register("duration")} className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-4 px-4 text-white font-bold italic outline-none">
                                <option value="5">5 Mins</option>
                                <option value="10">10 Mins</option>
                                <option value="15">15 Mins</option>
                            </select>
                            {errors.duration && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.duration.message as string}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-2 block">Calories</label>
                            <input type="number" {...register("caloriesBurn")} placeholder="kcal" className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-4 px-4 text-white font-bold italic outline-none" />
                            {errors.caloriesBurn && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.caloriesBurn.message as string}</p>}
                        </div>
                    </div>

                    {/* BODY FOCUS */}
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic mb-2 block">Body Focus Area</label>
                        <input {...register("bodyFocus")} placeholder="e.g. Legs, Core, Upper Body" className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-4 px-4 text-white focus:border-[#00ff94]/50 outline-none font-bold italic" />
                        {errors.bodyFocus && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.bodyFocus.message as string}</p>}
                    </div>

                    {/* FILE UPLOAD GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* VIDEO */}
                        <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 text-center space-y-4 hover:border-[#00ff94]/20 transition-all group">
                            <label className="cursor-pointer flex flex-col items-center gap-3">
                                <Upload size={32} className="text-gray-600 group-hover:text-[#00ff94] transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Workout Video</span>
                                <input type="file" accept="video/*" hidden onChange={(e) => setValue("video", e.target.files?.[0] as File, { shouldValidate: true })} />
                            </label>
                            {videoPreview && <video src={videoPreview} controls className="w-full rounded-xl border border-white/10 shadow-lg" />}
                            {errors.video && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.video.message as string}</p>}
                        </div>

                        {/* THUMBNAIL */}
                        <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 text-center space-y-4 hover:border-[#00ff94]/20 transition-all group">
                            <label className="cursor-pointer flex flex-col items-center gap-3">
                                <Upload size={32} className="text-gray-600 group-hover:text-[#00ff94] transition-colors" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 italic">Cover Image</span>
                                <input type="file" accept="image/*" hidden onChange={(e) => setValue("thumbnail", e.target.files?.[0] as File, { shouldValidate: true })} />
                            </label>
                            {thumbnailPreview && <img src={thumbnailPreview} className="w-full h-48 object-cover rounded-xl border border-white/10 shadow-lg" />}
                            {errors.thumbnail && <p className="text-red-400 text-[10px] mt-2 italic font-bold uppercase">{errors.thumbnail.message as string}</p>}
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex justify-end gap-4 pt-6 border-t border-white/5">
                        <button type="button" onClick={() => navigate("/admin/workouts")} className="px-8 py-4 text-gray-500 font-bold uppercase italic text-[10px] tracking-widest hover:text-white transition-colors">Cancel</button>
                        <button type="submit" disabled={isPending} className="flex items-center gap-2 bg-[#00ff94] text-black px-10 py-4 rounded-xl font-black uppercase italic text-xs tracking-widest hover:shadow-[0_0_30px_rgba(0,255,148,0.2)] disabled:opacity-50 transition-all">
                            <Save size={16} />
                            {isPending ? "Processing..." : mode === "create" ? "Publish Session" : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}