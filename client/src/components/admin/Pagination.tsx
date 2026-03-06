interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  resultsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, totalResults, resultsPerPage, onPageChange }: PaginationProps) => {
  const start = (currentPage - 1) * resultsPerPage + 1;
  const end = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <div className="flex items-center justify-between px-2 mt-6">
      <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest italic">
        Showing <span className="text-white">{start}</span> to <span className="text-white">{end}</span> of <span className="text-white">{totalResults}</span> results
      </p>
      
      <div className="flex items-center gap-2">
        <button 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="text-[11px] font-bold text-gray-500 hover:text-white disabled:opacity-30 uppercase italic px-4"
        >
          Previous
        </button>
        
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-[11px] font-bold transition-all ${
              currentPage === i + 1 ? "bg-[#00ff94] text-black shadow-[0_0_15px_#00ff94/30]" : "text-gray-500 hover:text-white"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="text-[11px] font-bold text-gray-500 hover:text-white disabled:opacity-30 uppercase italic px-4"
        >
          Next
        </button>
      </div>
    </div>
  );
};