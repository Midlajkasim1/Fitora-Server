
import { useNavigate } from "react-router-dom";

interface SpecializationCardProps {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export const SpecializationCard = ({
  id,
  name,
  description,
  imageUrl,
}: SpecializationCardProps) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/workouts/${id}`)}
      className="group relative bg-[#0d1f17] rounded-2xl overflow-hidden border border-white/5 hover:border-[#00ff94]/40 transition duration-300 cursor-pointer"
    >
      {/* IMAGE */}
      <div className="h-64 overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </div>

      {/* CONTENT */}
      <div className="p-6 space-y-3">
        <h3 className="text-white text-xl font-bold">
          {name}
        </h3>

        <p className="text-gray-300 text-[11px] font-bold italic leading-relaxed uppercase tracking-wider whitespace-pre-line">
          {description}
        </p>

        <div className="pt-2">
          <span className="text-[#00ff94] text-sm font-semibold tracking-wide">
            Explore Program →
          </span>
        </div>
      </div>

      {/* HOVER GLOW */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300 pointer-events-none bg-gradient-to-t from-[#00ff94]/10 to-transparent" />
    </div>
  );
};