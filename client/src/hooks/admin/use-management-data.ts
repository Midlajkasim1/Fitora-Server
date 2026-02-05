import { useEffect, useState } from "react";
import { useDebounce } from "./use-debounce";
import api from "../../api/axios";

export function useManagementData<T>(endpoint: string) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const debouncedSearch = useDebounce(search, 500);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(endpoint, {
        params: { page, search: debouncedSearch, status, limit: 10 }
      });
    const result = response.data.data;
      setData(result.users || result.trainers || []);
      setTotal(result.total || 0);
    } catch (error) {
      console.error("Management Data Fetch Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [page, debouncedSearch, status, endpoint]);
  useEffect(() => { setPage(1); }, [debouncedSearch, status]);

  return { data, total, isLoading, page, setPage, setSearch, setStatus, fetchData };
}