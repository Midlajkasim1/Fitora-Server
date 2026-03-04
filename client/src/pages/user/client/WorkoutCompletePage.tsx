import { useLocation, useNavigate } from "react-router-dom";
import { Flame, CheckCircle } from "lucide-react";

export default function WorkoutCompletedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { calories, title } = location.state || { calories: 0, title: "Workout" };

  return (
    <div className="min-h-screen bg-[#07140f] text-white flex flex-col items-center justify-center p-6 text-center">
      <CheckCircle size={80} className="text-[#00ff94] mb-6 animate-bounce" />
      
      <h1 className="text-5xl font-black uppercase italic mb-2">Workout Complete!</h1>
      <p className="text-gray-400 mb-8 font-bold uppercase tracking-widest">You finished: {title}</p>

      <div className="bg-[#0d1f17] p-10 rounded-[3rem] border border-[#00ff94]/20 mb-12 flex flex-col items-center">
        <Flame size={40} className="text-orange-500 mb-2" />
        <span className="text-7xl font-black italic text-[#00ff94]">{calories}</span>
        <p className="text-gray-500 font-black uppercase tracking-widest">Total Calories Burned</p>
      </div>

      <hr className="w-full max-w-md border-white/10 mb-12" />

      {/* Subscription Section */}
      <h2 className="text-2xl font-black uppercase italic mb-6">Upgrade Your Journey</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-[#00ff94] transition-all cursor-pointer">
          <h3 className="font-black italic text-xl mb-2">MONTHLY PLAN</h3>
          <p className="text-4xl font-black text-[#00ff94] mb-4">$19.99</p>
          <button className="w-full py-3 bg-[#00ff94] text-black font-black rounded-xl">SELECT</button>
        </div>
        <div className="bg-white/5 p-8 rounded-3xl border border-white/10 hover:border-[#00ff94] transition-all cursor-pointer">
          <h3 className="font-black italic text-xl mb-2">YEARLY PLAN</h3>
          <p className="text-4xl font-black text-[#00ff94] mb-4">$149.99</p>
          <button className="w-full py-3 bg-[#00ff94] text-black font-black rounded-xl">SELECT</button>
        </div>
      </div>

      <button onClick={() => navigate("/home")} className="mt-12 text-gray-500 font-bold uppercase underline">
        Back to Dashboard
      </button>
    </div>
  );
}