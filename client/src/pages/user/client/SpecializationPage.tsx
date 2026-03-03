import { SpecializationCard } from "../../../components/user/SpecializationCard";
import { useUserSpecializations } from "../../../hooks/user/workout/use-user-specialization";

export default function SpecializationListPage() {
  const { data, isLoading, isError } = useUserSpecializations();

  const specializations = data?.specialization || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-white text-lg py-40">
        Loading Programs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center text-red-500 text-lg py-40">
        Failed to load programs.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-14 pb-20">

      {/* HEADER */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
          Workout Specializations
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
          Choose a program that fits your fitness goal and start transforming your body today.
        </p>
      </div>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-10">
        {specializations.map((sp: any) => (
          <SpecializationCard
            key={sp.id}
            id={sp.id}
            name={sp.name}
            description={sp.description}
            imageUrl={sp.imageUrl}
          />
        ))}
      </div>

    </div>
  );
}