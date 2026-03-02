import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkoutSchema } from "../../validators/admin/workout.Schema";
import type { CreateWorkoutFormData } from "../../validators/admin/workout.Schema";
import { useCreateWorkout } from "../../hooks/admin/workout/use-create-workout";
import { useNavigate } from "react-router-dom";
import { AdminLayout } from "../../layout/admin/AdminLayout";
import { useSpecializationsForFilter } from "../../hooks/admin/use-admin-specializationFilter";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";

export default function CreateWorkoutPage() {
    const navigate = useNavigate();
    const mutation = useCreateWorkout();
    const { data: specializations } = useSpecializationsForFilter();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(createWorkoutSchema),
    });

    const videoFile = watch("video");
    const thumbnailFile = watch("thumbnail");

    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

    // Video Preview
    useEffect(() => {
        if (!videoFile) return;
        const url = URL.createObjectURL(videoFile);
        setVideoPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [videoFile]);

    // Thumbnail Preview
    useEffect(() => {
        if (!thumbnailFile) return;
        const url = URL.createObjectURL(thumbnailFile);
        setThumbnailPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [thumbnailFile]);

    const onSubmit = (data: CreateWorkoutFormData) => {
        toast.loading("Publishing workout...", { id: "publish" });

        mutation.mutate(data);
        navigate("/admin/workouts");
    };

    return (
        <AdminLayout>
            <div className="p-10 space-y-10 max-w-6xl">

                {/* HEADER */}
                <div>
                    <h2 className="text-3xl font-black text-white">
                        Create Workout Session
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        Publish a structured workout for users.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="bg-[#0a1810] border border-white/5 rounded-2xl p-8 space-y-8"
                >

                    {/* BASIC INFO SECTION */}
                    <div className="space-y-6">

                        {/* TITLE */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                                Workout Title
                            </label>
                            <input
                                {...register("title")}
                                className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#00ff94]/50 outline-none transition"
                            />
                            {errors.title && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.title.message as string}
                                </p>
                            )}
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                                Description
                            </label>
                            <textarea
                                {...register("description")}
                                rows={4}
                                className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#00ff94]/50 outline-none transition"
                            />

                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.description.message as string}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* WORKOUT DETAILS GRID */}
                    <div className="grid grid-cols-3 gap-6">

                        {/* SPECIALIZATION */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                                Specialization
                            </label>
                            <select
                                {...register("specializationId")}
                                className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#00ff94]/50 outline-none"
                            >
                                <option value="">Select</option>
                                {specializations?.map((sp: any) => (
                                    <option key={sp.id} value={sp.id}>
                                        {sp.name}
                                    </option>
                                ))}
                            </select>
                            {errors.specializationId && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.specializationId.message as string}
                                </p>
                            )}
                        </div>

                        {/* DIFFICULTY */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                                Difficulty
                            </label>
                            <select
                                {...register("difficulty")}
                                className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#00ff94]/50 outline-none"
                            >
                                <option value="">Select</option>
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                            </select>
                            {errors.difficulty && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.difficulty.message as string}
                                </p>
                            )}
                        </div>

                        {/* DURATION */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                                Duration
                            </label>
                            <select
                                {...register("duration")}
                                className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#00ff94]/50 outline-none"
                            >
                                <option value="">Select</option>
                                <option value="5">5 Minutes</option>
                                <option value="10">10 Minutes</option>
                                <option value="15">15 Minutes</option>
                            </select>
                            {errors.duration && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.duration.message as string}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* SECOND GRID */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* CALORIES */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                                Calories Burn
                            </label>
                            <input
                                type="number"
                                {...register("caloriesBurn")}
                                className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#00ff94]/50 outline-none"
                            />
                            {errors.caloriesBurn && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.caloriesBurn.message as string}
                                </p>
                            )}
                        </div>

                        {/* BODY FOCUS */}
                        <div>
                            <label className="text-xs text-gray-500 uppercase tracking-widest mb-2 block">
                                Body Focus
                            </label>
                            <input
                                {...register("bodyFocus")}
                                className="w-full bg-[#0d1f17] border border-white/10 rounded-xl py-3 px-4 text-white focus:border-[#00ff94]/50 outline-none"
                            />
                            {errors.bodyFocus && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.bodyFocus.message as string}
                                </p>
                            )}
                        </div>

                    </div>

                    {/* FILE UPLOAD SECTION */}
                    <div className="grid grid-cols-2 gap-8">

                        {/* VIDEO */}
                        <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center space-y-4">
                            <label className="cursor-pointer flex flex-col items-center gap-3 text-gray-400">
                                <Upload size={28} />
                                <span className="text-sm uppercase tracking-widest">
                                    Upload Video
                                </span>
                                <input
                                    type="file"
                                    accept="video/*"
                                    hidden
                                    onChange={(e) =>
                                        setValue("video", e.target.files?.[0] as File)
                                    }
                                />
                            </label>
                            {errors.video && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.video.message as string}
                                </p>
                            )}

                            {videoPreview && (
                                <video
                                    src={videoPreview}
                                    controls
                                    className="w-full rounded-xl border border-white/10"
                                />
                            )}
                        </div>

                        {/* THUMBNAIL */}
                        <div className="border border-dashed border-white/10 rounded-2xl p-6 text-center space-y-4">
                            <label className="cursor-pointer flex flex-col items-center gap-3 text-gray-400">
                                <Upload size={28} />
                                <span className="text-sm uppercase tracking-widest">
                                    Upload Thumbnail
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) =>
                                        setValue("thumbnail", e.target.files?.[0] as File)
                                    }
                                />
                            </label>
                            {errors.thumbnail && (
                                <p className="text-red-400 text-sm mt-2">
                                    {errors.thumbnail.message as string}
                                </p>
                            )}

                            {thumbnailPreview && (
                                <img
                                    src={thumbnailPreview}
                                    className="w-full max-h-60 object-cover rounded-xl border border-white/10"
                                />
                            )}
                        </div>

                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
                        <button
                            type="button"
                            onClick={() => navigate("/admin/workouts")}
                            className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="px-6 py-3 rounded-xl bg-[#00ff94] text-black font-bold hover:opacity-90 disabled:opacity-50 transition"
                        >
                            {mutation.isPending ? "Publishing..." : "Publish Workout"}
                        </button>
                    </div>

                </form>
            </div>
        </AdminLayout>
    );
}