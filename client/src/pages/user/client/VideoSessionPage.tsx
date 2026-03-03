import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Timer, Flame, XCircle, Play, Pause } from "lucide-react";

export default function VideoSessionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const workout = location.state?.workout;
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Correct Initialization: Parse duration from state
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const durationMinutes = Number(workout?.duration) || 0;
    console.log("Raw Duration from state:", workout?.duration);
    console.log("Timer Initialized with seconds:", durationMinutes * 60);
    return durationMinutes * 60;
  });

  const [isActive, setIsActive] = useState(false);

  // 2. Sync Video with isActive state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch((err) => {
        console.error("Playback blocked by browser:", err);
        setIsActive(false);
      });
    } else {
      video.pause();
    }
  }, [isActive]);

  // 3. Optimized Backward Timer
  useEffect(() => {
    // Clear any existing interval to prevent multiple timers
    if (intervalRef.current) clearInterval(intervalRef.current);

    if (isActive && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            console.log("Session Completed");
            setIsActive(false);
            if (videoRef.current) videoRef.current.pause();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]); // Only re-run when pause/play is toggled

  const formatTime = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!workout) {
    return (
      <div className="h-screen bg-[#07140f] flex items-center justify-center text-white font-black italic">
        SESSION DATA MISSING
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#07140f] text-white flex flex-col lg:flex-row overflow-hidden font-sans">
      
      {/* LEFT: MAIN VIDEO AREA */}
      <div className="flex-1 bg-black relative flex items-center justify-center">
        <video 
          ref={videoRef}
          src={workout.videoUrl} 
          className="w-full h-full object-contain"
          playsInline 
          onPlay={() => setIsActive(true)}
          onPause={() => setIsActive(false)}
        />
        
        {/* Title Overlay */}
        <div className="absolute top-8 left-8 bg-black/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10">
          <h1 className="text-[#00ff94] font-black uppercase italic tracking-widest text-lg">
            {workout.title}
          </h1>
        </div>
      </div>

      {/* RIGHT: CONTROL DASHBOARD */}
      <div className="w-full lg:w-96 bg-[#0d1f17] p-8 flex flex-col justify-between border-l border-white/5">
        <div className="space-y-8">
          <h2 className="text-gray-500 font-black uppercase italic text-xs tracking-[0.3em]">Live Metrics</h2>

          {/* Timer Card */}
          <div className="bg-black/20 p-8 rounded-[2rem] border border-white/5 flex flex-col items-center">
            <Timer size={24} className={isActive ? "text-[#00ff94] animate-pulse" : "text-gray-600"} />
            <span className="text-5xl font-black italic tracking-tighter tabular-nums mt-2">
              {formatTime(secondsLeft)}
            </span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Remaining Time</p>
          </div>

          {/* Calories Card */}
          <div className="bg-[#00ff94]/5 p-8 rounded-[2rem] border border-[#00ff94]/10 flex flex-col items-center">
            <Flame size={24} className="text-orange-500" />
            <span className="text-4xl font-black italic text-[#00ff94] mt-2">
              {workout.caloriesBurn}
            </span>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Est. Calories</p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="space-y-4">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full py-5 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3 transition-all border ${
              isActive 
              ? "bg-white/5 border-white/10 hover:bg-white/20" 
              : "bg-[#00ff94] text-black border-[#00ff94] hover:shadow-[0_0_20px_rgba(0,255,148,0.3)]"
            }`}
          >
            {isActive ? <><Pause size={18} /> Pause Session</> : <><Play size={18} /> Resume Session</>}
          </button>

          <button 
            onClick={() => navigate('/home')}
            className="w-full py-5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl font-black uppercase italic text-xs flex items-center justify-center gap-3 hover:bg-red-500/20 transition-all"
          >
            <XCircle size={18} /> Stop Session
          </button>
        </div>
      </div>
    </div>
  );
}