import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Timer, Flame, XCircle, Play, Pause } from "lucide-react";

export default function VideoSessionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const workout = location.state?.workout;

  const [secondsLeft, setSecondsLeft] = useState(() => (Number(workout?.duration) || 0) * 60);
  const [isActive, setIsActive] = useState(false);

  const goToResults = () => {
    setIsActive(false);
    navigate("/workouts/completed", { 
      state: { 
        calories: workout?.caloriesBurn, 
        title: workout?.title 
      } 
    });
  };

  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive) {
      videoRef.current.play().catch(() => setIsActive(false));
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);


  useEffect(() => {
    let interval: any = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setTimeout(() => goToResults(), 0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, goToResults]); 

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!workout) return <div className="h-screen bg-[#07140f] flex items-center justify-center text-white">Loading Workout...</div>;

  return (
    <div className="h-screen bg-[#07140f] text-white flex flex-col lg:flex-row overflow-hidden">
      
      <div className="flex-1 bg-black relative flex items-center justify-center">
        <video 
          ref={videoRef}
          src={workout.videoUrl} 
          className="w-full h-full object-contain"
          playsInline 
          onEnded={goToResults} 
          onPlay={() => setIsActive(true)}
          onPause={() => setIsActive(false)}
        />
        
        <div className="absolute top-6 left-6 bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
          <h1 className="text-[#00ff94] font-bold italic uppercase tracking-wider">{workout.title}</h1>
        </div>
      </div>

      {/* RIGHT SIDE: DASHBOARD */}
      <div className="w-full lg:w-96 bg-[#0d1f17] p-8 flex flex-col justify-between border-l border-white/5">
        <div className="space-y-8">
          <h2 className="text-gray-500 font-bold uppercase italic text-xs tracking-widest">Session Stats</h2>

          {/* Timer Display */}
          <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center mb-2">
            <Timer size={24} className={isActive ? "text-[#00ff94] animate-pulse" : "text-gray-600"} />
            <span className="text-6xl font-black italic tracking-tighter mt-2 tabular-nums">
              {formatTime(secondsLeft)}
            </span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Remaining</p>
          </div>

          {/* Calories Display */}
          <div className="bg-[#00ff94]/5 p-10 rounded-[2.5rem] border border-[#00ff94]/10 flex flex-col items-center ">
            <Flame size={24} className="text-orange-500" />
            <span className="text-4xl font-black italic text-[#00ff94] mt-2">{workout.caloriesBurn}</span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Est. Burned</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="space-y-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full py-5 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3 transition-all border ${
              isActive ? "bg-white/5 border-white/10" : "bg-[#00ff94] text-black border-[#00ff94]"
            }`}
          >
            {isActive ? <><Pause size={18} fill="currentColor" /> Pause Session</> : <><Play size={18} fill="currentColor" /> Resume Session</>}
          </button>

          <button 
            onClick={() => navigate('/workouts')}
            className="w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3"
          >
            <XCircle size={18} /> Exit Workout
          </button>
        </div>
      </div>
    </div>
  );
}