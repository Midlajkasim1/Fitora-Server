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
    let interval: ReturnType<typeof setInterval> | undefined = undefined;
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
    <div className="min-h-screen lg:h-screen bg-[#07140f] text-white flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
      
      {/* VIDEO SECTION */}
      <div className="flex-none h-[40vh] md:h-[50vh] lg:h-full lg:flex-1 bg-black relative group flex items-center justify-center landscape:h-screen landscape:lg:h-full transition-all duration-500">
        <video 
          ref={videoRef}
          src={workout.videoUrl} 
          className="w-full h-full object-contain"
          playsInline 
          onEnded={goToResults} 
          onClick={() => setIsActive(!isActive)}
        />
        
        {/* Seek Controls */}
        <div className="absolute inset-0 flex items-center justify-center gap-6 md:gap-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <button onClick={(e) => { e.stopPropagation(); handleSeek(-10); }} className="p-3 md:p-4 bg-white/10 hover:bg-[#00ff94] hover:text-black rounded-full backdrop-blur-md transition-all pointer-events-auto">
            <RotateCcw size={20} className="md:w-7 md:h-7" />
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); setIsActive(!isActive); }} className="p-4 md:p-6 bg-[#00ff94] text-black rounded-full scale-110 shadow-[0_0_30px_rgba(0,255,148,0.4)] pointer-events-auto">
            {isActive ? <Pause size={24} className="md:w-8 md:h-8" fill="currentColor" /> : <Play size={24} className="md:w-8 md:h-8" fill="currentColor" />}
          </button>
          
          <button onClick={(e) => { e.stopPropagation(); handleSeek(10); }} className="p-3 md:p-4 bg-white/10 hover:bg-[#00ff94] hover:text-black rounded-full backdrop-blur-md transition-all pointer-events-auto">
            <RotateCw size={20} className="md:w-7 md:h-7" />
          </button>
        </div>

        <div className="absolute top-4 left-4 md:top-6 md:left-6 bg-black/50 px-3 md:px-4 py-1.5 md:py-2 rounded-lg md:rounded-xl backdrop-blur-sm border border-white/10">
          <h1 className="text-[#00ff94] text-xs md:text-base font-bold italic uppercase tracking-wider">{workout.title}</h1>
        </div>
      </div>

      {/* RIGHT SIDE: DASHBOARD */}
      <div className="flex-1 w-full lg:w-96 bg-[#0d1f17] p-6 md:p-8 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/5 landscape:hidden landscape:lg:flex">
        <div className="space-y-6 md:space-y-8">
          <h2 className="text-gray-500 font-bold uppercase italic text-[10px] tracking-widest">Session Stats</h2>

          <div className="grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-8">
            {/* Timer Display */}
            <div className="bg-black/40 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 flex flex-col items-center justify-center">
              <Timer size={18} className={isActive ? "text-[#00ff94] animate-pulse" : "text-gray-600"} />
              <span className="text-3xl md:text-5xl lg:text-6xl font-black italic tracking-tighter mt-1 md:mt-2 tabular-nums">
                {formatTime(secondsLeft)}
              </span>
              <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 md:mt-2">Remaining</p>
            </div>

            {/* Calories Display */}
            <div className="bg-[#00ff94]/5 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-[#00ff94]/10 flex flex-col items-center justify-center">
              <Flame size={18} className="text-orange-500" />
              <span className="text-2xl md:text-4xl font-black italic text-[#00ff94] mt-1 md:mt-2">{workout.caloriesBurn}</span>
              <p className="text-[8px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1 md:mt-2">Est. Burned</p>
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="mt-8 lg:mt-0 space-y-3 md:space-y-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black uppercase italic text-[10px] md:text-xs flex items-center justify-center gap-3 transition-all border ${
              isActive ? "bg-white/5 border-white/10" : "bg-[#00ff94] text-black border-[#00ff94]"
            }`}
          >
            {isActive ? <><Pause size={16} fill="currentColor" /> Pause Session</> : <><Play size={16} fill="currentColor" /> Resume Session</>}
          </button>

          <button 
            onClick={() => { setIsActive(false); setIsSkipModalOpen(true); }}
            className="w-full py-4 md:py-5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl md:rounded-2xl font-black uppercase italic text-[10px] md:text-xs flex items-center justify-center gap-3 transition-all"
          >
            <FastForward size={16} /> Skip Workout
          </button>

          <button 
            onClick={() => navigate('/workouts')}
            className="w-full py-4 md:py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl md:rounded-2xl font-black uppercase italic text-[10px] md:text-xs flex items-center justify-center gap-3"
          >
            <XCircle size={16} /> Exit Workout
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