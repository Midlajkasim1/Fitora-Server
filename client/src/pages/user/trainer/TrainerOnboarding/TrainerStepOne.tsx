import { UploadCloud, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "../../../../components/auth/onboarding/OnboardingLayout";
import { useOnboardingStore } from "../../../../store/use-onboarding-store";
export default function TrainerStepOne() {
  const navigate = useNavigate();
  
  const { setTrainerStepOne, trainerStepOne } = useOnboardingStore();

  const [files, setFiles] = useState<File[]>(trainerStepOne?.certificates || []);

 const { register, handleSubmit, setError, clearErrors, formState: { errors } } = useForm({
    defaultValues: {
      bio: trainerStepOne?.bio || "",
      experienceYear: trainerStepOne?.experienceYear || 0,
      gender: trainerStepOne?.gender || "male"
    }
  });
const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files.length > 0) {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
    clearErrors("root.serverError"); 
  }
};
const removeFile = (index: number) => {
  const updatedFiles = files.filter((_, idx) => idx !== index);
  setFiles(updatedFiles);
  
  if (updatedFiles.length === 0) {
    setError("root.serverError", { message: "You must upload at least one certification." });
  }
};
 const onSubmit = (data: any) => {
    let hasError = false;

    if (files.length === 0) {
      setError("root.serverError", { message: "You must upload at least one certification." });
      hasError = true;
    }

    if (data.bio.trim().length < 20) {
      setError("bio", { message: "Bio is too short. Please provide at least 20 characters." });
      hasError = true;
    }

    if (hasError) return;

    setTrainerStepOne({
      ...data,
      certificates: files
    });
    navigate("/onboarding/trainer/step-2");
  };
  return (
<OnboardingLayout title="Tell Us About You" step={1}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-gray-400 text-[10px] uppercase font-bold italic">Bio</label>
            <textarea
              {...register("bio")}
              placeholder="Tell us about your fitness background..."
              className={`w-full bg-[#0a1810] border ${errors.bio ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-4 h-40 text-white outline-none focus:border-[#00ff94]/50 transition-all`}
            />
            {errors.bio && <p className="text-red-500 text-[10px] mt-1 italic font-bold">{errors.bio.message}</p>}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-gray-400 text-[10px] uppercase font-bold italic">Experience (Years)</label>
              <input
                type="number"
                {...register("experienceYear", { valueAsNumber: true })}
                className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-[#00ff94]/50 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-gray-400 text-[10px] uppercase font-bold italic">Gender</label>
              <select
                {...register("gender")}
                className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-[#00ff94]/50 transition-all"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`border-2 border-dashed ${errors.root?.serverError ? 'border-red-500/50 bg-red-500/5' : 'border-white/10 bg-[#0d1f17]'} rounded-2xl p-10 text-center group hover:border-[#00ff94]/30 transition-all cursor-pointer relative`}>
          <input
            type="file"
            multiple
            onChange={onFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            id="cert-upload"
          />
          <UploadCloud className={`mx-auto w-12 h-12 ${errors.root?.serverError ? 'text-red-500' : 'text-[#00ff94]'} mb-4`} />
          <p className="text-white font-bold italic">Click to upload or drag and drop</p>
          
          {errors.root?.serverError && (
            <p className="text-red-500 text-[10px] font-black uppercase mt-2 italic">
              {errors.root.serverError.message}
            </p>
          )}

          <p className="text-[10px] text-gray-500 uppercase font-bold mt-1">
            Certifications (PDF, JPG or PNG - MAX. 5MB)
          </p>
<div className="mt-4 flex flex-wrap gap-2 justify-center relative z-10">
  {files.map((f, i) => (
    <div 
      key={i} 
      className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 text-[10px] border border-white/20 text-gray-200 backdrop-blur-sm"
    >
      {f.name}
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation(); 
          removeFile(i);
        }}
        className="hover:bg-red-500/20 p-0.5 rounded-full transition-colors"
      >
        <X className="w-3 h-3 text-red-500 hover:text-red-400" />
      </button>
    </div>
  ))}
</div>
        </div>

        <button
          type="submit"
          className="w-full bg-[#00ff94] text-[#0d1f1d] font-black py-5 rounded-2xl italic uppercase tracking-tighter hover:shadow-[0_0_20px_rgba(0,255,148,0.4)] transition-all"
        >
          Next Step →
        </button>
      </form>
    </OnboardingLayout>
  );
}