import { ShieldCheck, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { VerifyOtpForm } from '../../components/auth/VerifyOtpForm';
import { useAuth } from '../../hooks/user/use-auth';

interface VerifyPageProps {
  mode: 'register' | 'reset';
}

const VerifyPage = ({ mode }: VerifyPageProps) => {
  const { state } = useLocation();
  const { 
    verifyOtp, isVerifying,          
    verifyResetOtp, isVerifyingOtp, 
    sendResetOtp, isSendingOtp     
  } = useAuth();
  
  const [timer, setTimer] = useState(60);
  const email = state?.email;

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  if (!email) return <Navigate to={mode === 'register' ? "/register" : "/forgot-password"} replace />;

  const onVerifySubmit = (otp: string) => {
    if (mode === 'register') {
      verifyOtp({ email, otp });
    } else {
      verifyResetOtp({ email, otp });
    }
  };

  const handleResend = () => {
    if (mode === 'reset') sendResetOtp({ email });
    setTimer(60);
  };

  return (
    <div className="min-h-screen w-full bg-[#0a1810] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md bg-[#0d1f17] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1a3535] flex items-center justify-center border border-[#00ff88]/20">
            <ShieldCheck className="w-8 h-8 text-[#00ff88]" />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white text-center mb-4 italic uppercase tracking-tighter">
          {mode === 'register' ? 'Verify Account' : 'Reset Verification'}
        </h1>

        <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed italic">
          Enter the 6-digit code sent to <br />
          <span className="text-[#00ff88] font-bold">{email}</span>
        </p>

        <VerifyOtpForm 
          onSubmit={onVerifySubmit} 
          isLoading={mode === 'register' ? isVerifying : isVerifyingOtp} 
        />
        
        <div className="mt-8 text-center space-y-4">
            <button
              onClick={handleResend}
              disabled={timer > 0 || isSendingOtp}
              className="text-[#00ff88] font-black uppercase italic tracking-tighter hover:underline disabled:opacity-30"
            >
              {timer > 0 ? `Resend in ${timer}s` : "Resend Now"}
            </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyPage;