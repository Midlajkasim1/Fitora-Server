import { useState } from "react";
import { SpecializationCard } from "../../../components/user/SpecializationCard";
import { useUserSpecializations } from "../../../hooks/user/workout/use-user-specialization";
import { Pagination } from "../../../components/admin/Pagination"; 

export default function SpecializationListPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 6;

  const { data, isLoading, isError } = useUserSpecializations(currentPage);

  const specializations = data?.specialization || [];
  const totalResults = data?.total || 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center text-white text-lg py-40 animate-pulse font-black uppercase italic tracking-widest">
        Syncing Programs...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center text-red-500 text-lg py-40 font-bold italic">
        Failed to load programs. Please try again.
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-14 pb-20 px-6">
      
      {/* HEADER */}
      <div className="text-center space-y-4 pt-10">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight uppercase italic">
          Workout <span className="text-[#00ff94]">Specializations</span>
        </h1>
        <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto italic font-medium">
          Choose a program that fits your fitness goal and start transforming your body today.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {specializations.length > 0 ? (
          specializations.map((sp: any) => (
            <SpecializationCard
              key={sp.id}
              id={sp.id}
              name={sp.name}
              description={sp.description}
              imageUrl={sp.imageUrl}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-20 text-gray-500 italic">
            No specializations found for this page.
          </div>
        )}
      </div>

      {totalResults > 0 && (
        <div className="pt-12 border-t border-white/5">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </div>
      )}
    </div>
  );
}