import { GoogleLogin } from '@react-oauth/google';
import { UserIcon } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RegisterForm } from '../../components/auth/RegisterForm';
import { useAuth } from '../../hooks/user/use-auth';
import { Footer } from '../../layout/Footer';
import { Header } from '../../layout/Header';
import type { RegisterPayload } from '../../type/auth.types';

const RegisterPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'user' | 'trainer'>('user');
  const navigate = useNavigate();
  const { register, isRegistering, googleLogin } = useAuth();

  const handleRegister = (data: RegisterPayload) => {
    register(data);
  };

  const handleGoogleSuccess = (credentialResponse: any) => {
    googleLogin({ 
      idToken: credentialResponse.credential, 
      role: selectedRole 
    });
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0a1810]">
      <Header showNav={false} showLogin={false} showSignup={false} />

      <main className="flex-1 flex items-center justify-center pt-28 pb-12 px-4 relative">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#00ff94]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-[#0d1f17]/90 backdrop-blur-md rounded-2xl p-8 border border-white/5 relative z-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-[#00ff94] rounded-2xl flex items-center justify-center shadow-lg shadow-[#00ff94]/20">
              <UserIcon className="w-8 h-8 text-[#0d1f1d]" />
            </div>
          </div>

          <h1 className="text-2xl font-black text-white text-center mb-2 italic uppercase tracking-tighter">
            Create Account
          </h1>
          <p className="text-gray-400 text-xs text-center mb-8">
            Select your role as a {selectedRole}
          </p>

          <RegisterForm
            onSubmit={handleRegister}
            isLoading={isRegistering}
            onRoleChange={(role) => setSelectedRole(role)}
          />

          <div className="mt-6 flex flex-col items-center gap-4">
            <div className="flex items-center w-full gap-4">
              <div className="h-[1px] flex-1 bg-white/5" />
              <span className="text-[10px] text-gray-600 font-bold uppercase">Or</span>
              <div className="h-[1px] flex-1 bg-white/5" />
            </div>
            
            <div className="w-full flex justify-center mt-2">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => alert('Google Auth Failed')}
                theme="filled_black"
                shape="pill"
                text="signup_with"
                width="100%"
              />
            </div>
          </div>

          <p className="text-center text-gray-500 text-xs mt-8">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#00ff94] font-bold underline decoration-[#00ff94]/30"
            >
              Log In
            </button>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPage;