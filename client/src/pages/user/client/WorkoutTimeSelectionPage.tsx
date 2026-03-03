import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStartWorkout } from "../../../hooks/user/workout/use-user-startWorkout-session";

export default function WorkoutConfiguration() {
  const { id } = useParams(); // Specialization ID
  const navigate = useNavigate();
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");
  const [selectedDuration, setSelectedDuration] = useState(5);
  const [shouldFetch, setShouldFetch] = useState(false);

const { data, isFetching, isError, error } = useStartWorkout(
  {
    id: id!,
    difficulty: selectedDifficulty,
    duration: selectedDuration,
  },
  shouldFetch // Pass this as the second argument
);

  // Effect to navigate once data is received
  if (data && shouldFetch) {
    navigate(`/workouts/session/${data.id}`, { state: { workout: data } });
    setShouldFetch(false);
  }

  const handleStart = () => {
    setShouldFetch(true);
  };

  return (
    <div className="min-h-screen bg-[#07140f] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-black italic uppercase text-[#00ff94] mb-4">Select Time</h1>
      
      {/* Difficulty Selection Cards */}
      <div className="flex gap-6 mb-12">
        {["Easy", "Intermediate", "Advanced"].map((level) => (
          <div
            key={level}
            onClick={() => setSelectedDifficulty(level.toLowerCase())}
            className={`cursor-pointer p-10 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 w-52 ${
              selectedDifficulty === level.toLowerCase() 
                ? "border-[#00ff94] bg-[#00ff94]/5" 
                : "border-white/5 bg-[#0d1f17]"
            }`}
          >
            <span className="font-bold uppercase italic">{level}</span>
          </div>
        ))}
      </div>

      {/* Duration Selection */}
      <div className="flex gap-10 mb-16">
        {[5, 10, 15].map((time) => (
          <button
            key={time}
            onClick={() => setSelectedDuration(time)}
            className={`text-sm font-black italic uppercase tracking-widest transition-all ${
              selectedDuration === time ? "text-[#00ff94]" : "text-gray-600"
            }`}
          >
            {time}:00 Minutes
          </button>
        ))}
      </div>

      <button 
        onClick={handleStart}
        disabled={isFetching}
        className="px-16 py-5 bg-[#00ff94] text-black font-black rounded-2xl uppercase italic text-sm hover:shadow-[0_0_30px_rgba(0,255,148,0.4)] transition-all disabled:opacity-50"
      >
        {isFetching ? "Syncing..." : "Start"}
      </button>

      {isError && <p className="text-red-500 mt-4 italic">{(error as any)?.response?.data?.message || "No session found"}</p>}
    </div>
  );
}