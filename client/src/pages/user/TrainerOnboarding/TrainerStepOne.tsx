import React from 'react';

export const TrainerStepOne: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a1810] flex flex-col items-center justify-center p-6">
      <div className="bg-[#0d1f17] border border-white/5 p-10 rounded-3xl text-center max-w-md w-full">
        <h1 className="text-3xl font-black italic uppercase text-[#00ff94] mb-4">Trainer Onboarding</h1>
        <p className="text-gray-400 mb-8">Set up your professional coaching profile.</p>
        <div className="bg-white/5 h-32 rounded-xl mb-8 flex items-center justify-center border border-dashed border-white/20">
          Trainer Portfolio Setup
        </div>
      </div>
    </div>
  );
};