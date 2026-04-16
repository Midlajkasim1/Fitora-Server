import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Utensils, Plus } from 'lucide-react';
import { AiStatItem } from '../../../../components/user/ai-workout&diet/AiStatItem';

const AiSelectionPage = () => {
  const navigate = useNavigate();

  return (
    // Reduced padding and used flex-col on mobile to keep items compact
    <div className="min-h-screen bg-[#05110B] text-white selection:bg-green-500/30 flex items-center p-4 md:p-8 lg:p-12">
      <div className="max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
        
        <div className="flex-1 space-y-6 lg:space-y-8 text-center lg:text-left">
          {/* Tagline: Smaller padding */}
          <div className="flex justify-center lg:justify-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0A1A12] border border-green-500/20 text-green-500 text-[9px] font-black tracking-[0.2em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              AI Personalization
            </div>
          </div>

          {/* Heading: Reduced from text-8xl to text-5xl/text-7xl to save vertical space */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] lg:leading-[0.95] tracking-tighter">
            Achieve Your <br /> 
            <span className="text-green-500 italic">Wellness</span> Goals <br /> 
            With AI
          </h1>

          <p className="text-gray-500 max-w-md mx-auto lg:mx-0 text-base md:text-lg font-medium leading-relaxed">
            Advanced AI tailored to your preferences.
          </p>
          
          {/* Selection Cards: Grid stays 2 cols to keep them "Above the fold" */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectionCard 
              icon={<Dumbbell className="text-green-500" size={24} />}
              title="Workout"
              subtitle="Daily routines"
              onClick={() => navigate('/ai-workout')}
            />
            <SelectionCard 
              icon={<Utensils className="text-green-500" size={24} />}
              title="Diet"
              subtitle="Smart nutrition"
              onClick={() => navigate('/ai-diet')}
            />
          </div>

          {/* Stats: Smaller margin-top */}
          <div className="flex justify-center lg:justify-start gap-10 md:gap-16 pt-6 border-t border-[#1A2E24]">
            <AiStatItem label="Tailored" value="100%" />
            <AiStatItem label="Support" value="24/7" />
            <AiStatItem label="Metrics" value="50+" />
          </div>
        </div>

        {/* Image Section: Hidden or smaller on mobile to prioritize buttons */}
        <div className="flex-1 relative w-full hidden lg:block max-w-xl">
          <div className="relative group">
            <div className="absolute -inset-1 bg-green-500/20 rounded-[2.5rem] blur opacity-20"></div>
            <img 
              src="https://jimmyjrichard.com/wp-content/uploads/2024/08/Create-a-futuristic-gym-setting-where-advanced-AI-technology-is-integrated-into-every-aspect-of-the-workout.-Picture-a-muscular-individual-lifting-weights-with-holographic-AI-displays-guiding-the.png" 
              className="relative rounded-[2.5rem] opacity-50 grayscale border border-green-500/10 object-cover aspect-[4/3]" 
              alt="AI Gym" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SelectionCard = ({ icon, title, subtitle, onClick }: any) => (
  <button 
    onClick={onClick} 
    className="group flex items-center text-left gap-4 p-4 bg-[#0A1A12] border border-[#1A2E24] rounded-2xl hover:border-green-500/40 transition-all duration-300"
  >
    <div className="w-12 h-12 shrink-0 rounded-xl bg-[#05110B] border border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="flex-1">
      <h3 className="text-lg font-bold text-white group-hover:text-green-400 transition-colors">{title}</h3>
      <p className="text-gray-600 text-[10px] font-bold uppercase tracking-tighter">{subtitle}</p>
    </div>
    <div className="ml-auto">
        <Plus className="text-gray-700 group-hover:text-green-500" size={16} />
    </div>
  </button>
);

export default AiSelectionPage;