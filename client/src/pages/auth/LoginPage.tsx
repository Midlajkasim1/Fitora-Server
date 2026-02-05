import { Link } from "react-router-dom";
import { LoginForm } from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/user/use-auth";

export default function LoginPage() {
  const { login, googleLogin, isLoggingIn, isGoogleLoading } = useAuth();

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0a1810] text-white selection:bg-[#00ff94] selection:text-[#0d1f17]">
      <header className="p-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#00ff94] rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform">
            <div className="w-4 h-4 bg-[#0a1810] rounded-full translate-x-1" />
          </div>
          <span className="font-black italic uppercase tracking-tighter text-xl">AI Fitness</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 relative overflow-hidden pb-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none opacity-50" />
        <div className="absolute top-1/3 right-0 w-[300px] h-[300px] bg-[#00ff94]/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          <div className="bg-[#0d1f17]/90 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 border border-white/5 shadow-2xl text-center">
            
            <div className="w-14 h-14 bg-[#00ff94]/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#00ff94]/20">
              <svg className="w-7 h-7 text-[#00ff94]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <h1 className="text-3xl font-black italic tracking-tighter uppercase mb-2">Welcome back</h1>
            <p className="text-gray-400 text-xs font-medium italic mb-10">Please enter your details to sign in.</p>

            <LoginForm 
              onSubmit={login}
              onGoogleLogin={(token) => googleLogin({ idToken: token, role: "user" })}
              isLoading={isLoggingIn}
              isGoogleLoading={isGoogleLoading}
            />

            <div className="mt-10">
              <p className="text-[11px] text-gray-500 font-medium italic">
                Don't have an account yet?{" "}
                <Link to="/register" className="text-[#00ff94] font-black hover:underline ml-1 uppercase tracking-tighter">
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-8 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-gray-600 font-bold uppercase tracking-widest italic relative z-10">
        <div className="flex gap-8">
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <Link to="/support" className="hover:text-white transition-colors">Contact Support</Link>
        </div>
        <span className="text-gray-700 font-black tracking-tighter">© 2026 AI Fitness Inc.</span>
      </footer>
    </div>
  );
}