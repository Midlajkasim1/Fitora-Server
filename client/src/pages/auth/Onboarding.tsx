import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a1810] flex items-center justify-center p-6 text-white">
      <div className="max-w-lg w-full bg-[#0d1f17] border border-white/5 p-10 rounded-3xl text-center">
        <h1 className="text-3xl font-black italic uppercase text-[#00ff94] mb-4">
          {role} Onboarding
        </h1>
        <p className="text-gray-400 mb-8">
          {role === 'trainer' 
            ? "Complete your professional profile to start coaching." 
            : "Tell us about your fitness goals to personalize your journey."}
        </p>
        
        <div className="bg-white/5 h-48 rounded-xl mb-8 flex items-center justify-center border border-dashed border-white/20">
           {role === 'trainer' ? "Trainer Setup Form" : "User Preferences Form"}
        </div>

        <button 
          onClick={() => navigate('/home')}
          className="w-full bg-[#00ff94] text-[#0d1f17] font-black py-4 rounded-xl"
        >
          Complete Setup
        </button>
      </div>
    </div>
  );
};

export default Onboarding;