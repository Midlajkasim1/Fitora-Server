import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStartWorkout } from "../../../hooks/user/workout/use-user-startWorkout-session";

export default function WorkoutConfiguration() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState("beginner");
  const [duration, setDuration] = useState(5);

  const { isFetching, isError, error, refetch } = useStartWorkout(
    {
      id: id!,
      difficulty: difficulty,
      duration: duration,
    },
    false 
  );

  const handleStart = async () => {
    const result = await refetch();

    if (result.data) {
      navigate(`/workouts/session/${result.data.id}`, { 
        state: { workout: result.data } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#07140f] text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-black uppercase italic text-[#00ff94] mb-10 text-center">
        Customize Session
      </h1>

      {/* DIFFICULTY SELECTION */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {["Easy", "Intermediate", "Advanced"].map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level.toLowerCase())}
            className={`px-8 py-6 rounded-2xl border-2 font-bold uppercase italic transition-all ${
              difficulty === level.toLowerCase()
                ? "border-[#00ff94] bg-[#00ff94]/10 text-[#00ff94]"
                : "border-white/5 bg-[#0d1f17] text-gray-500"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      {/* DURATION SELECTION */}
      <div className="flex flex-wrap justify-center gap-8 mb-16">
        {[5, 10, 15].map((mins) => (
          <button
            key={mins}
            onClick={() => setDuration(mins)}
            className={`text-lg font-black uppercase italic transition-all ${
              duration === mins ? "text-[#00ff94] border-b-2 border-[#00ff94]" : "text-gray-600 hover:text-white"
            }`}
          >
            {mins} Mins
          </button>
        ))}
      </div>

      {/* START ACTION */}
      <button
        onClick={handleStart}
        disabled={isFetching}
        className="px-16 py-5 bg-[#00ff94] text-black font-black rounded-xl uppercase italic hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
      >
        {isFetching ? "Locating Workout..." : "Start Workout"}
      </button>

      {/* ERROR HANDLING */}
      {isError && (
        <p className="mt-6 text-red-500 font-bold italic bg-red-500/10 px-4 py-2 rounded-lg">
          {(error as any)?.response?.data?.message || "No workout found for this selection."}
        </p>
      )}
    </div>
  );
}