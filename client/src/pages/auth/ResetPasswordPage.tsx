import { useForm } from "react-hook-form";
import { useLocation, Navigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/user/use-auth";
import { Lock, Loader2 } from "lucide-react";

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetData = z.infer<typeof resetSchema>;

const ResetPasswordPage = () => {
  const location = useLocation();
  const token = location.state?.token;
  const { resetPassword, isResettingPassword } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<ResetData>({
    resolver: zodResolver(resetSchema),
  });

  if (!token) return <Navigate to="/forgot-password" replace />;

  const onSubmit = (data: ResetData) => {
    resetPassword({ token, password: data.password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0a1810] px-4">
      <div className="w-full max-w-md bg-[#0d1f17] rounded-[2.5rem] p-10 border border-white/5">
        <h1 className="text-2xl font-black italic uppercase text-white mb-6 text-center">Create New Password</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 italic ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                {...register("password")}
                type="password"
                className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 pl-12 text-white outline-none focus:border-[#00ff94]/50"
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-[10px] font-bold italic">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-gray-500 italic ml-1">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                {...register("confirmPassword")}
                type="password"
                className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 pl-12 text-white outline-none focus:border-[#00ff94]/50"
                placeholder="••••••••"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-[10px] font-bold italic">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isResettingPassword}
            className="w-full bg-[#00ff94] text-[#0d1f17] font-black py-4 rounded-2xl uppercase italic hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] disabled:opacity-50 transition-all flex items-center justify-center"
          >
            {isResettingPassword ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;