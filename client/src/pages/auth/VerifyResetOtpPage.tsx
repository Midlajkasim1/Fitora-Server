// // pages/auth/VerifyResetOtppPage.tsx
// import { ShieldCheck, Loader2 } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useLocation, Navigate } from 'react-router-dom';
// import { VerifyOtpForm } from '../../components/auth/VerifyOtpForm';
// import { useAuth } from '../../hooks/user/use-auth';

// const VerifyResetOtpPage = () => {
//   const { state } = useLocation();
//   const { verifyResetOtp, isVerifyingOtp, sendResetOtp, isSendingOtp } = useAuth();
  
//   const [timer, setTimer] = useState(60);
//   const email = state?.email;

//   // Timer logic
//   useEffect(() => {
//     if (timer <= 0) return;
//     const interval = setInterval(() => setTimer((t) => t - 1), 1000);
//     return () => clearInterval(interval);
//   }, [timer]);

//   if (!email) return <Navigate to="/forgot-password" replace />;

//   const onVerifySubmit = (otp: string) => {
//     verifyResetOtp({ email, otp });
//   };

//   const handleResend = () => {
//     sendResetOtp({ email });
//     setTimer(60);
//   };

//   return (
//     <div className="min-h-screen w-full bg-[#0a1810] flex flex-col items-center justify-center px-4">
//       <div className="w-full max-w-md bg-[#0d1f17] border border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
        
//         {/* Decorative Glow */}
//         <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00ff88]/10 blur-[80px] rounded-full" />

//         <div className="flex justify-center mb-6">
//           <div className="w-16 h-16 rounded-2xl bg-[#1a3535] flex items-center justify-center border border-[#00ff88]/20">
//             <ShieldCheck className="w-8 h-8 text-[#00ff88]" />
//           </div>
//         </div>

//         <h1 className="text-2xl sm:text-3xl font-black text-white text-center mb-4 italic uppercase tracking-tighter">
//           Reset Verification
//         </h1>

//         <p className="text-gray-400 text-center mb-8 text-sm leading-relaxed italic">
//           Enter the 6-digit code sent to <br />
//           <span className="text-[#00ff88] font-bold">{email}</span>
//         </p>

//         <VerifyOtpForm 
//           onSubmit={onVerifySubmit} 
//           isLoading={isVerifyingOtp} 
//         />
        
//         <div className="mt-8 text-center space-y-4">
//             <div className="text-sm">
//               <span className="text-gray-500 italic">Didn't get the code?</span>{" "}
//               <button
//                 onClick={handleResend}
//                 disabled={timer > 0 || isSendingOtp}
//                 className="text-[#00ff88] font-black uppercase italic tracking-tighter hover:underline disabled:opacity-30 disabled:no-underline transition-all"
//               >
//                 {isSendingOtp ? (
//                   <Loader2 className="w-3 h-3 animate-spin inline mr-1" />
//                 ) : null}
//                 {timer > 0 ? `Resend in ${timer}s` : "Resend Now"}
//               </button>
//             </div>

//             <p className="text-[10px] text-gray-700 font-bold uppercase italic tracking-widest pt-4 border-t border-white/5">
//               Step 2 of 3: Identity Verification
//             </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyResetOtpPage;