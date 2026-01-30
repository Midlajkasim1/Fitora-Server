import React, { useState,useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Header } from '../../layout/Header';
import { Footer } from '../../layout/Footer';
import { VerifyOtpForm } from '../../components/auth/VerifyOtpForm';
import { resendOtp } from "../../api/auth.api";
import { useAuth } from '../../hooks/use-auth';

export default function VerifyOtpPage() {
const { state } = useLocation();
  const navigate = useNavigate();
  
  const { verifyOtp, isVerifying } = useAuth(); 

  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const email = state?.email || "your email";

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = async () => {
    try {
      setResending(true);
      await resendOtp({ email }); 
      setTimer(60); 
      alert("OTP resent successfully!");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setResending(false);
    }
  };


const onVerifySubmit = (otp: string) => {
    verifyOtp({ email, otp });
  };

  return (
    <div className="min-h-screen w-full bg-[#0a1810] flex flex-col">
      <Header showNav={false} showLogin={false} showSignup={false} />

      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-20">
        <div className="w-full max-w-md">
          <div className="bg-[#0d1f17] border border-white/5 rounded-[2rem] p-8 sm:p-10 shadow-2xl">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-[#1a3535] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#00ff88]" />
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white text-center mb-4 italic uppercase tracking-tighter">
              OTP Verification
            </h1>

            <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed">
              We've sent a 6-digit verification code to <br />
              <span className="text-white font-medium">{email}</span>
            </p>

            <VerifyOtpForm onSubmit={onVerifySubmit} isLoading={isVerifying} />

            <div className="mt-6 text-center">
              <span className="text-gray-500 text-sm">Didn't receive the code?</span>{' '}
              <button
                onClick={handleResendOtp}
                disabled={timer > 0 || resending}
                className="text-[#00ff88] font-bold text-sm disabled:opacity-40"
              >
                {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
              </button>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}