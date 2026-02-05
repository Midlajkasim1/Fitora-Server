interface Column<T> {
  header: string;
  render: (item: T, index: number) => React.ReactNode; 
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
}

export function DataTable<T>({ columns, data, isLoading }: DataTableProps<T>) {
  return (
    <div className="w-full bg-[#0a1810]/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            {columns.map((col, i) => (
              <th key={i} className="p-5 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 italic">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/[0.03]">
          {isLoading ? (
            <tr>
              <td colSpan={columns.length} className="p-20 text-center text-[#00ff94] animate-pulse font-black italic uppercase tracking-widest">
                Loading Data...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-20 text-center text-gray-600 italic">
                No records found matching your criteria.
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-white/[0.02] transition-all group">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-5">
                    {col.render(item, rowIndex)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}