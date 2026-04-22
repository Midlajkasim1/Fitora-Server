import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { FINANCE_ROUTES } from "../../constants/api.constants";

export const useFinanceOverview = () => {
    return useQuery({
        queryKey: ["finance-overview"],
        queryFn: async () => {
            const response = await axiosInstance.get(FINANCE_ROUTES.OVERVIEW);
            return response.data;
        }
    });
};

export const useRecentTransactions = (params: { page: number; limit: number; search?: string }) => {
    return useQuery({
        queryKey: ["recent-transactions", params],
        queryFn: async () => {
            const response = await axiosInstance.get(FINANCE_ROUTES.TRANSACTIONS, { params });
            return response.data;
        }
    });
};

export const exportFinanceReport = async (startDate: string, endDate: string) => {
    const response = await axiosInstance.get(FINANCE_ROUTES.REPORT, {
        params: { startDate, endDate },
        responseType: 'blob'
    });
    
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `finance-report-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};
