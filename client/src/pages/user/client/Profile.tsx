import { useState } from "react";
import { User, Phone, Dumbbell, Target, Lock, Edit3,Receipt } from "lucide-react";
import { useUpdateUser, useUploadProfileImage, useUser } from "../../../hooks/user/use-user";
import { ProfileField } from "../../../components/user/UserProfileInput";
import { useSpecializations } from "../../../hooks/user/use-specialization";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import type { Specialization, UserProfileResponse } from "../../../type/user.types";
import { GlobalLoader } from "../../../shared/GlobalLoader";

export default function UserProfile() {
  const { user, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateProfile, isPending } = useUpdateUser();
  const { mutate: uploadImage } = useUploadProfileImage();
  const queryClient = useQueryClient();
  const { data: specialization = [] as Specialization[] } = useSpecializations();
  const experienceOptions = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" }
  ];
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    preferredWorkouts: "",
    experienceLevel: ""
  });
  const avatarSrc =
    user?.profileImage ||
    (user?.gender === "male"
      ? "/avatarMale.png"
      : user?.gender === "female"
        ? "/avatarFemale.png"
        : "/default-avatar.png");

  const handleEditToggle = () => {
    if (!isEditing && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        preferredWorkouts: user.preferredWorkouts || "",
        experienceLevel: user.experienceLevel || ""
      });
    }
    setIsEditing(!isEditing);
  };






  const handleSave = () => {
    updateProfile({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      preferredWorkouts: formData.preferredWorkouts,
      experienceLevel: formData.experienceLevel,
    });

    setIsEditing(false);
  };
  const preferredWorkoutId = user?.preferredWorkouts;

  const preferredWorkoutName = specialization.find(
    (s: Specialization) => s.id === preferredWorkoutId
  )?.name;





  if (isLoading) {
    return <GlobalLoader />;
  }

  return (
    <div className="min-h-screen bg-[#0d1f17] text-white flex flex-col font-sans">

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full border-2 border-[#00ff94] p-1 shadow-[0_0_15px_rgba(0,255,148,0.2)]">
                  <img
                    src={avatarSrc}
                    className="w-full h-full rounded-full object-cover"
                    alt="Profile"
                  />
                </div>

                <label className="absolute bottom-0 right-0 bg-[#00ff94] p-2 rounded-full text-[#0d1f17] hover:scale-110 transition-transform shadow-lg cursor-pointer">
                  <Edit3 size={14} />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      const previewUrl = URL.createObjectURL(file);

                      queryClient.setQueryData(["user-profile"], (oldData: UserProfileResponse | undefined) => {
                        if (!oldData) return oldData;

                        return {
                          ...oldData,
                          data: {
                            ...oldData.data,
                            profileImage: previewUrl
                          }
                        };
                      });

                      const formData = new FormData();
                      formData.append("profileImage", file);

                      uploadImage(formData);
                    }}
                  />
                </label>
              </div>

              <div>
                <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                  Profile Settings
                </h1>
                <p className="text-[#00ff94] text-[10px] font-black uppercase italic tracking-widest mt-1">
                  Refine your performance data
                </p>
              </div>
            </div>

           <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
    
    {/* Billing History Link (Always Visible) */}
    {!isEditing && (
      <Link
        to="/purchase-history"
        className="flex items-center justify-center gap-2 w-full sm:w-auto bg-white/5 border border-white/10 text-white px-6 py-4 rounded-2xl font-black uppercase italic text-xs hover:bg-white/10 transition-all group"
      >
        <Receipt size={14} className="text-[#00ff94] group-hover:scale-110 transition-transform" />
        Billing History
      </Link>
    )}

    {/* Edit / Save Button */}
    <button
      onClick={() => {
        if (isEditing) {
          handleSave();
        } else {
          handleEditToggle();
        }
      }}
      disabled={isPending}
      className="w-full sm:w-auto bg-[#00ff94] text-[#0d1f17] px-8 py-4 rounded-2xl font-black uppercase italic text-xs hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all disabled:opacity-50"
    >
      {isEditing ? "Save Changes" : "Edit Profile"}
    </button>
  </div>
          </div>

          {/* Container */}
          <div className="bg-[#0a1810] border border-white/5 rounded-[2.5rem] p-8 md:p-14 shadow-2xl">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">

              {/* First Name */}
              <ProfileField
                icon={<User size={16} />}
                label="First Name"
                value={isEditing ? formData.firstName : user?.firstName}
                isEditing={isEditing}
                onChange={(val) => setFormData({ ...formData, firstName: val })}
              />

              {/* Last Name */}
              <ProfileField
                icon={<User size={16} />}
                label="Last Name"
                value={isEditing ? formData.lastName : user?.lastName}
                isEditing={isEditing}
                onChange={(val) => setFormData({ ...formData, lastName: val })}
              />

              {/* Phone */}
              <ProfileField
                icon={<Phone size={16} />}
                label="Phone Number"
                value={isEditing ? formData.phone : user?.phone}
                isEditing={isEditing}
                onChange={(val) => setFormData({ ...formData, phone: val })}
              />

              {/* Preferred Workout */}
              <ProfileField
                icon={<Target size={16} />}
                label="Preferred Workout"
                value={isEditing ? formData.preferredWorkouts : preferredWorkoutName}
                isEditing={isEditing}
                options={specialization.map((s: Specialization) => ({

                  label: s.name,
                  value: s.id
                }))}
                onChange={(val) =>
                  setFormData({ ...formData, preferredWorkouts: val })
                }
              />

              {/* Experience Level */}
              <ProfileField
                icon={<Dumbbell size={16} />}
                label="Experience Level"
                value={isEditing ? formData.experienceLevel : user?.experienceLevel}
                isEditing={isEditing}
                options={experienceOptions}
                onChange={(val) => setFormData({ ...formData, experienceLevel: val })}
              />

            </div>

            {/* Divider */}
            <div className="h-px bg-white/5 w-full my-12" />

            {/* Password Section */}
            <div className="flex items-center justify-between flex-wrap gap-8 p-6 bg-[#0d1f17]/50 rounded-3xl border border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-[#00ff94]/5 rounded-2xl flex items-center justify-center text-[#00ff94]">
                  <Lock size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-black uppercase italic text-white tracking-tight">
                    Security Credentials
                  </h4>
                  <p className="text-gray-600 text-[9px] font-bold uppercase italic mt-1 tracking-tighter">
                    Keep your session access secure
                  </p>
                </div>
              </div>
              <Link
                to="/change-password"
                className="w-full md:w-auto border-2 border-[#00ff94]/20 hover:border-[#00ff94] text-[#00ff94] px-8 py-4 rounded-xl font-black uppercase italic text-[10px] transition-all flex items-center justify-center gap-3"
              >
                <Lock size={14} />
                Change Password
              </Link>

            </div>

          </div>

        </div>
      </main>

    </div>
  );
}