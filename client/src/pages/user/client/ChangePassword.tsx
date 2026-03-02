import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserHeader } from "../../../layout/client/ClientHeader";
import { UserFooter } from "../../../layout/client/ClientFooter";
import { useChangePassword } from "../../../hooks/user/use-user";


// ------------------
// ZOD SCHEMA
// ------------------

const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export default function ChangePassword() {
  const navigate = useNavigate();
  const { mutate, isPending } = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema)
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    mutate(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      },
      {
        onSuccess: () => {
          navigate("/profile", { replace: true });
        }
      }
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1f17] text-white flex flex-col font-sans">
      <UserHeader />

      <main className="flex-1 pt-32 pb-20">
        <div className="max-w-xl mx-auto px-6">

          {/* Title */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-black italic uppercase tracking-tight">
              Change Password
            </h1>
            <p className="text-[#00ff94] text-[10px] font-black uppercase italic tracking-widest mt-2">
              Secure your account credentials
            </p>
          </div>

          <div className="bg-[#0a1810] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

              {/* Current Password */}
              <div>
                <label className="text-xs font-black uppercase italic text-gray-400">
                  Current Password
                </label>
                <input
                  type="password"
                  {...register("currentPassword")}
                  className="w-full mt-3 bg-[#0d1f17] border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#00ff94]"
                />
                {errors.currentPassword && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-black uppercase italic text-gray-400">
                  New Password
                </label>
                <input
                  type="password"
                  {...register("newPassword")}
                  className="w-full mt-3 bg-[#0d1f17] border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#00ff94]"
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-black uppercase italic text-gray-400">
                  Confirm Password
                </label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full mt-3 bg-[#0d1f17] border border-white/10 p-4 rounded-xl text-sm outline-none focus:border-[#00ff94]"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-2">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-[#00ff94] text-[#0d1f17] py-4 rounded-2xl font-black uppercase italic text-xs hover:shadow-[0_0_30px_rgba(0,255,148,0.3)] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                <Lock size={16} />
                {isPending ? "Updating..." : "Update Password"}
              </button>

            </form>

          </div>
        </div>
      </main>

      <UserFooter />
    </div>
  );
}