import { useState, useEffect } from "react";
import { User, Phone, Briefcase, Wallet, Edit3, Lock, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { GlobalLoader } from "../../../shared/GlobalLoader";

import { useTrainerProfile } from "../../../hooks/trainer/profile/use-trainer-profile";
import { TrainerProfileField } from "../../../components/trainer/TrainerProfileField";
import { trainerProfileSchema, type TrainerProfileFormData } from "../../../validators/trainer/profile.validator";
import { useUser } from "../../../hooks/user/use-user";

export default function TrainerProfilePage() {
  const { trainer, isLoading, updateProfile, uploadAvatar, isUpdating } = useTrainerProfile();
  const [isEditing, setIsEditing] = useState(false);
    const { user } = useUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TrainerProfileFormData>({
    resolver: zodResolver(trainerProfileSchema) as any,
  });

  useEffect(() => {
    if (trainer) {
      reset({
        firstName: trainer.firstName,
        lastName: trainer.lastName,
        phone: trainer.phone,
        experience_year: trainer.experience_year,
      });
    }
  }, [trainer, reset]);

  if (isLoading || !trainer) {
    return <GlobalLoader />;
  }

  const onSubmit = (data: TrainerProfileFormData) => {
    updateProfile(data, {
      onSuccess: () => setIsEditing(false),
    });
  };
  const avatarSrc =
    trainer?.profileImage ||
    (user?.gender === "male"
      ? "/avatarMale.png"
      : user?.gender === "female"
        ? "/avatarFemale.png"
        : "/default-avatar.png");

  return (
    <div className="space-y-10">
      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-[#00ff94] p-1 shadow-[0_0_20px_rgba(0,255,148,0.2)] overflow-hidden bg-black">
              <img
                src={avatarSrc}
                className="w-full h-full rounded-full object-cover"
                alt="Profile"
              />
            </div>
            <label className="absolute bottom-0 right-0 bg-[#00ff94] p-2.5 rounded-full text-[#0d1f17] hover:scale-110 transition-transform cursor-pointer shadow-lg">
              <Edit3 size={14} />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const fd = new FormData();
                    fd.append("profileImg", file);
                    uploadAvatar(fd);
                  }
                }}
              />
            </label>
          </div>
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">Account settings</h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-[#00ff94]/10 text-[#00ff94] text-[9px] font-black uppercase italic rounded-lg flex items-center gap-1">
                <ShieldCheck size={10} /> {trainer.status}
              </span>
              {trainer.specializationName && (
                <span className="px-3 py-1 bg-white/5 text-gray-400 text-[9px] font-black uppercase italic rounded-lg border border-white/5">
                  {trainer.specializationName}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!isEditing && (
            <Link
              to="/trainer/wallet"
              className="flex items-center gap-2 bg-white/5 border border-white/10 px-6 py-4 rounded-2xl font-black uppercase text-white italic text-xs hover:bg-white/10 transition-all"
            >
              <Wallet size={14} className="text-[#00ff94]" /> Wallet
            </Link>
          )}
          <button
            onClick={() => (isEditing ? handleSubmit(onSubmit)() : setIsEditing(true))}
            disabled={isUpdating}
            className="bg-[#00ff94] text-[#0d1f17] px-10 py-4 rounded-2xl font-black uppercase italic text-xs hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all disabled:opacity-50"
          >
            {isEditing ? (isUpdating ? "Saving..." : "Apply Changes") : "Edit Profile"}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-[#0a1810] border border-white/5 rounded-[3rem] p-10 md:p-14 shadow-2xl">
        <form className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <TrainerProfileField
            icon={<User size={16} />}
            label="First Name"
            name="firstName"
            value={trainer.firstName}
            isEditing={isEditing}
            register={register}
            error={errors.firstName?.message}
          />
          <TrainerProfileField
            icon={<User size={16} />}
            label="Last Name"
            name="lastName"
            value={trainer.lastName}
            isEditing={isEditing}
            register={register}
            error={errors.lastName?.message}
          />
          <TrainerProfileField
            icon={<Phone size={16} />}
            label="Contact Number"
            name="phone"
            value={trainer.phone}
            isEditing={isEditing}
            register={register}
            error={errors.phone?.message}
          />
          <TrainerProfileField
            icon={<Briefcase size={16} />}
            label="Experience (Years)"
            name="experience_year"
            value={trainer.experience_year}
            isEditing={isEditing}
            register={register}
            error={errors.experience_year?.message}
          />
        </form>

        <div className="h-px bg-white/5 w-full my-12" />

        {/* Password Security Box */}
        <div className="flex items-center justify-between p-6 bg-black/20 rounded-3xl border border-white/5 group hover:border-[#00ff94]/30 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-[#00ff94]/5 rounded-2xl flex items-center justify-center text-[#00ff94]">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black uppercase italic text-white tracking-tight">Security Credentials</h4>
              <p className="text-gray-600 text-[9px] font-bold uppercase italic mt-1 tracking-widest">Update your login password</p>
            </div>
          </div>
          <Link
            to="/trainer/change-password"
            className="border-2 border-[#00ff94]/20 text-[#00ff94] px-8 py-3 rounded-xl font-black uppercase italic text-[10px] hover:bg-[#00ff94] hover:text-black transition-all flex items-center gap-2"
          >
            <Lock size={12} /> Manage Access
          </Link>
        </div>
      </div>
    </div>
  );
}