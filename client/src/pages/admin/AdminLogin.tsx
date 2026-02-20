import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "../../hooks/admin/use-admin-auth";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAdminAuth();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#050a05] px-4 font-sans selection:bg-[#00ff94] selection:text-black">
      
      <div className="absolute inset-0 bg-gradient-to-b from-[#00ff94]/5 to-transparent pointer-events-none" />

      <div className="w-full max-w-md relative">
        <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 w-4/5 h-[2px] bg-gradient-to-r from-transparent via-[#00ff94] to-transparent shadow-[0_0_15px_#00ff94]" />

        <div className="bg-[#0a1810]/80 backdrop-blur-2xl rounded-3xl p-10 border border-white/5 shadow-2xl">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Admin Portal</h1>
            <p className="text-gray-500 text-sm font-medium leading-relaxed">
              Welcome back. Please enter your credentials to access the dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit((data) => login(data))} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
              <input
                {...register("email")}
                type="email"
      
                placeholder="admin@fitness.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#00ff94]/50 focus:bg-white/[0.08] transition-all"
              />
              {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.email.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                //   value={"Admin@123"}
                  placeholder="Enter your password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#00ff94]/50 focus:bg-white/[0.08] transition-all pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{errors.password.message as string}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#00ff94] text-black font-black py-4 rounded-xl hover:bg-[#00ff94]/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,148,0.2)]"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
            </button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-10 flex flex-col items-center gap-4">
          <div className="flex gap-6 text-[11px] font-bold text-gray-600 uppercase tracking-widest italic">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Contact Support</a>
          </div>
          <p className="text-[9px] text-gray-700 font-bold italic uppercase">
            © 2024 AI Fitness Systems. Unauthorized access is prohibited.
          </p>
        </div>
      </div>
    </div>
  );
}