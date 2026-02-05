import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../hooks/user/use-auth";
import { Mail, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

type FormData = z.infer<typeof schema>;

const ForgotPasswordPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { sendResetOtp, isSendingOtp } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0a1810] text-white overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="w-full max-w-md bg-[#0d1f17]/90 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-[#00ff94]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#00ff94]/20">
              <Mail className="w-8 h-8 text-[#00ff94]" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Reset Password</h1>
            <p className="text-gray-400 text-xs font-medium italic">Enter your email to receive a 6-digit verification code.</p>
          </div>

          <form onSubmit={handleSubmit((data) => sendResetOtp(data))} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest italic ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#00ff94] transition-colors" />
                <input
                  {...register("email")}
                  className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 pl-12 text-white outline-none focus:border-[#00ff94]/50 transition-all placeholder:text-gray-800"
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-[10px] font-bold italic ml-1">{errors.email.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSendingOtp}
              className="w-full bg-[#00ff94] text-[#0d1f17] font-black py-4 rounded-2xl uppercase italic tracking-tighter hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isSendingOtp ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Code"}
            </button>
          </form>

          <Link to="/login" className="flex items-center justify-center gap-2 mt-8 text-[11px] text-gray-500 font-bold uppercase italic hover:text-[#00ff94] transition-colors">
            <ArrowLeft className="w-3 h-3" /> Back to Login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ForgotPasswordPage;