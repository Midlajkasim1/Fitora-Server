import React, { useRef, } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight } from 'lucide-react';

const otpSchema = z.object({
  otp: z.string().length(6, "Code must be exactly 6 digits"),
});

type OtpFormData = z.infer<typeof otpSchema>;

interface VerifyOtpFormProps {
  onSubmit: (otp: string) => void;
  isLoading?: boolean;
}

export const VerifyOtpForm: React.FC<VerifyOtpFormProps> = ({ onSubmit, isLoading }) => {
  const { handleSubmit, setValue, watch, formState: { errors } } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' }
  });

  const otpValue = watch('otp');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const currentOtp = otpValue.split('');
    currentOtp[index] = val.substring(val.length - 1);
    const newOtpStr = currentOtp.join('');
    
    setValue('otp', newOtpStr, { shouldValidate: true });

    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otpValue[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit((data) => onSubmit(data.otp))} className="space-y-8 w-full">

      
      <div className="grid grid-cols-6 gap-2 sm:gap-3 max-w-fit mx-auto">
        {[...Array(6)].map((_, i) => (
          <input
            key={i}
            ref={(el) => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otpValue[i] || ''}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            className={`w-10 h-12 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-[#1a3535] border ${
              errors.otp ? 'border-red-500/50' : 'border-[#2a4a4a]'
            } text-[#00ff88] rounded-xl focus:border-[#00ff88] outline-none transition-all shadow-inner`}
          />
        ))}
      </div>
      
      {errors.otp && (
        <p className="text-red-500 text-[10px] text-center font-bold uppercase tracking-wider animate-pulse">
          {errors.otp.message}
        </p>
      )}

      <button
        type="submit"
        disabled={otpValue.length !== 6 || isLoading}
        className="w-full py-4 bg-[#00ff88] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:hover:scale-100 rounded-xl font-black text-[#0d1f17] flex items-center justify-center gap-2 transition-all uppercase text-xs tracking-widest shadow-lg shadow-[#00ff88]/10"
      >
        {isLoading ? "Verifying..." : (
          <>
            <span>Verify & Proceed</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
};