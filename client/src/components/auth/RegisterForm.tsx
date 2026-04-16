import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {  UserIcon, MailIcon, PhoneIcon, LockIcon,  UserCheckIcon, ShieldCheckIcon, EyeIcon, EyeOffIcon }from'lucide-react';
const registerSchema = z.object({
  role: z.enum(['user', 'trainer']),
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  email: z.string().email("Invalid email address"),
phone: z
  .string()
  .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: Omit<RegisterFormData, 'confirmPassword'>) => void;
  isLoading?: boolean;
  onRoleChange: (role: 'user' | 'trainer') => void; 
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, onRoleChange, isLoading }) => {
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user' }
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const selectedRole = watch('role');

  useEffect(() => {
    onRoleChange(selectedRole);
  }, [selectedRole, onRoleChange]);

const onInternalSubmit = (data: RegisterFormData) => {
  onSubmit(data); 
};

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputClass = (error?: any) => `w-full bg-[#0a1f1c] border ${error ? 'border-red-500/50' : 'border-white/5'} p-3 rounded-lg text-white outline-none focus:border-[#00ff94]/50 transition-all text-sm pl-10`;

  return (
    <form onSubmit={handleSubmit(onInternalSubmit)} className="space-y-4">
      <div className="flex gap-3 md:gap-4 mb-6">
        {(['user', 'trainer'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setValue('role', type)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all ${
              selectedRole === type ? 'bg-[#00ff94]/10 border-[#00ff94] text-[#00ff94]' : 'bg-transparent border-white/10 text-gray-500'
            }`}
          >
            <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${selectedRole === type ? 'border-[#00ff94]' : 'border-gray-600'}`}>
              {selectedRole === type && <div className="w-1.5 h-1.5 bg-[#00ff94] rounded-full" />}
            </div>
            {type === 'user' ? <UserCheckIcon size={16} /> : <ShieldCheckIcon size={16} />}
            <span className="text-xs font-bold capitalize">{type}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input placeholder="First Name" className={inputClass(errors.firstName)} {...register('firstName')} />
          {errors.firstName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.firstName.message}</p>}
        </div>
        <div className="relative">
          <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input placeholder="Last Name" className={inputClass(errors.lastName)} {...register('lastName')} />
          {errors.lastName && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="relative">
        <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input type="email" placeholder="Email Address" className={inputClass(errors.email)} {...register('email')} />
        {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.email.message}</p>}
      </div>

    <div className="relative">
        <PhoneIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input 
          type="tel" 
          placeholder="Phone Number" 
          maxLength={10} 
          className={inputClass(errors.phone)} 
          {...register('phone')} 
        />
        {errors.phone && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.phone.message}</p>}
      </div>
<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type={showPass ? "text" : "password"} 
            placeholder="Password" 
            className={inputClass(errors.password)} 
            {...register('password')} 
          />
          <button 
            type="button" 
            onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00ff94]"
          >
            {showPass ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
          {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.password.message}</p>}
        </div>

        <div className="relative">
          <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type={showConfirm ? "text" : "password"} 
            placeholder="Confirm" 
            className={inputClass(errors.confirmPassword)} 
            {...register('confirmPassword')} 
          />
          <button 
            type="button" 
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00ff94]"
          >
            {showConfirm ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
          </button>
          {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-[#00ff94] text-[#0d1f17] font-black py-4 rounded-xl hover:scale-[1.01] transition-all disabled:opacity-50 shadow-lg shadow-[#00ff94]/10 mt-2"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up Now'}
      </button>

    </form>
  );
};