import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Timer, Flame, XCircle, Play, Pause, RotateCcw, RotateCw, FastForward } from "lucide-react";
import { ConfirmModal } from "../../../shared/ConfirmModal";

export default function VideoSessionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const workout = location.state?.workout;

  const [secondsLeft, setSecondsLeft] = useState(() => (Number(workout?.duration) || 0) * 60);
  const [isActive, setIsActive] = useState(false);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState(false);

  const goToResults = useCallback(() => {
    setIsActive(false);
    navigate("/workouts/completed", { 
      state: { calories: workout?.caloriesBurn, title: workout?.title } 
    });
  }, [navigate, workout]);

  const handleSeek = (amount: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += amount;
      setSecondsLeft((prev) => {
        const newTime = prev - amount;
        return newTime < 0 ? 0 : newTime;
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => setIsActive(false));
    } else {
      video.pause();
    }
  }, [isActive]);
  
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, [isActive, secondsLeft, goToResults]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (!workout) return <div className="h-screen bg-[#07140f] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="h-screen bg-[#07140f] text-white flex flex-col lg:flex-row overflow-hidden">
      
      {/* VIDEO SECTION */}
      <div className="flex-1 bg-black relative group flex items-center justify-center">
        <video 
          ref={videoRef}
          src={workout.videoUrl} 
          className="w-full h-full object-contain"
          playsInline 
          onEnded={goToResults} 
          onClick={() => setIsActive(!isActive)}
        />
        
        {/* Seek Controls: Visible on Hover */}
        <div className="absolute inset-0 flex items-center justify-center gap-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button onClick={(e) => { e.stopPropagation(); handleSeek(-10); }} className="p-4 bg-white/10 hover:bg-[#00ff94] hover:text-black rounded-full backdrop-blur-md transition-all pointer-events-auto">
            <RotateCcw size={28} />
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); setIsActive(!isActive); }} className="p-6 bg-[#00ff94] text-black rounded-full scale-110 shadow-[0_0_30px_rgba(0,255,148,0.4)] pointer-events-auto">
            {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); handleSeek(10); }} className="p-4 bg-white/10 hover:bg-[#00ff94] hover:text-black rounded-full backdrop-blur-md transition-all pointer-events-auto">
            <RotateCw size={28} />
          </button>
        </div>

        <div className="absolute top-6 left-6 bg-black/50 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
          <h1 className="text-[#00ff94] font-bold italic uppercase tracking-wider">{workout.title}</h1>
        </div>
      </div>

      {/* RIGHT SIDE: DASHBOARD */}
      <div className="w-full lg:w-96 bg-[#0d1f17] p-8 flex flex-col justify-between border-l border-white/5">
        <div className="space-y-8">
          <h2 className="text-gray-500 font-bold uppercase italic text-xs tracking-widest">Session Stats</h2>

          {/* Timer Display */}
          <div className="bg-black/40 p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center">
            <Timer size={24} className={isActive ? "text-[#00ff94] animate-pulse" : "text-gray-600"} />
            <span className="text-6xl font-black italic tracking-tighter mt-2 tabular-nums">
              {formatTime(secondsLeft)}
            </span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Remaining</p>
          </div>

          {/* Calories Display */}
          <div className="bg-[#00ff94]/5 p-10 rounded-[2.5rem] border border-[#00ff94]/10 flex flex-col items-center">
            <Flame size={24} className="text-orange-500" />
            <span className="text-4xl font-black italic text-[#00ff94] mt-2">{workout.caloriesBurn}</span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-2">Est. Burned</p>
          </div>
        </div>

        {/* CONTROLS - Now includes the permanent Skip button */}
        <div className="space-y-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full py-5 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3 transition-all border ${
              isActive ? "bg-white/5 border-white/10" : "bg-[#00ff94] text-black border-[#00ff94]"
            }`}
          >
            {isActive ? <><Pause size={18} fill="currentColor" /> Pause Session</> : <><Play size={18} fill="currentColor" /> Resume Session</>}
          </button>

          {/* ALWAYS VISIBLE SKIP BUTTON */}
          <button 
            onClick={() => { setIsActive(false); setIsSkipModalOpen(true); }}
            className="w-full py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3 transition-all"
          >
            <FastForward size={18} /> Skip Workout
          </button>

          <button 
            onClick={() => navigate('/workouts')}
            className="w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3"
          >
            <XCircle size={18} /> Exit Workout
          </button>
        </div>
      </div>

      <ConfirmModal 
        isOpen={isSkipModalOpen}
        onClose={() => setIsSkipModalOpen(false)}
        onConfirm={goToResults}
        title="Skip Workout?"
        message="This will mark the workout as finished and show your results. Proceed?"
        confirmText="Skip & Finish"
      />
    </div>
  );
}