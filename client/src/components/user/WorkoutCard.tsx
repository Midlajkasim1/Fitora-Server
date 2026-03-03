import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

interface Props {
  id: string;
  title: string;
  difficulty: string;
  duration: number;
  caloriesBurn: number;
  thumbnailUrl?: string;
  isFree?: boolean;
}

export const WorkoutCard = ({
  id,
  title,
  difficulty,
  duration,
  caloriesBurn,
  thumbnailUrl,
  isFree,
}: Props) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() =>
        isFree
          ? navigate(`/workouts/session/${id}`)
          : navigate("/subscription")
      }
      className="group bg-[#0d1f17] rounded-2xl overflow-hidden border border-white/5 hover:border-[#00ff94]/40 transition cursor-pointer"
    >
      <div className="relative h-52 overflow-hidden">
        <img
          src={thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />

        {!isFree && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Lock className="text-white" />
          </div>
        )}
      </div>

      <div className="p-5 space-y-2">
        <h3 className="text-white font-bold text-lg">{title}</h3>

        <div className="flex justify-between text-xs text-gray-400 uppercase tracking-widest">
          <span>{difficulty}</span>
          <span>{duration} min</span>
        </div>

        <div className="text-[#00ff94] text-sm font-semibold">
          {caloriesBurn} kcal
        </div>
      </div>
    </div>
  );
};