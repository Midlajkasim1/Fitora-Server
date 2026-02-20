import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2, EyeOff, Eye } from "lucide-react";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import { Link } from "react-router-dom";
import { useState } from "react";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});
debugger;
type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
    onSubmit: (data: LoginFormData) => void;
    onGoogleLogin: (token: string) => void;
    isLoading: boolean;
    isGoogleLoading: boolean;
}

export const LoginForm = ({ onSubmit, onGoogleLogin, isLoading }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false); 
    const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });


    return (
        <div className="w-full space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2 text-left">
                    <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest italic ml-1">
                        Username or Email
                    </label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#00ff94] transition-colors" />
                        <input
                            {...register("email")}
                            type="email"
                            placeholder="Enter your email"
                            className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 pl-12 text-white outline-none focus:border-[#00ff94]/50 transition-all placeholder:text-gray-800"
                        />
                    </div>
                    {errors.email && <p className="text-red-500 text-[10px] italic font-bold ml-1">{errors.email.message}</p>}
                </div>

                <div className="space-y-2 text-left">
                    <div className="flex justify-between items-center px-1">
                        <label className="text-[10px] uppercase font-bold text-gray-500 tracking-widest italic">
                            Password
                        </label>
                        <Link
                            to="/forgot-password"
                            className="text-[10px] text-[#00ff94] font-bold italic hover:underline hover:text-[#00ff94]/80 transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>
                  <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-[#00ff94] transition-colors" />
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"} 
                            placeholder="••••••••"
                            className="w-full bg-[#0a1810] border border-white/5 rounded-2xl p-4 pl-12 pr-12 text-white outline-none focus:border-[#00ff94]/50 transition-all placeholder:text-gray-800"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#00ff94] transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-[10px] italic font-bold ml-1">{errors.password.message}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#00ff94] text-[#0d1f17] font-black py-4 rounded-2xl uppercase italic tracking-tighter hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log In"}
                </button>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-[10px] uppercase font-bold italic text-gray-600">
                    <span className="bg-[#0d1f17] px-4 font-black">Or continue with</span>
                </div>
            </div>

            <div className="w-full flex flex-col items-center justify-center mt-2">

                <div className="w-[300px] flex justify-center">
                    <GoogleLogin
                        onSuccess={(credentialResponse) => {
                            if (credentialResponse.credential) {
                                onGoogleLogin(credentialResponse.credential);
                            }
                        }}
                        use_fedcm_for_prompt={true}
                        onError={() => {
                            console.error('Google Login Failed');
                        }}
                        theme="filled_black"
                        shape="pill"
                        size="large"
                        text="continue_with"
                        width="300px"
                    />
                </div>
            </div>
        </div>
    );
};