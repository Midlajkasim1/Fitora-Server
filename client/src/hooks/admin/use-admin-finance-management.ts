import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axios";
import { FINANCE_ROUTES } from "../../constants/api.constants";

export const useFinanceOverview = () => {
    return useQuery({
        queryKey: ["finance-overview"],
        queryFn: async () => {
            const response = await axiosInstance.get(FINANCE_ROUTES.OVERVIEW);
            return response.data.data;
        }
    });
};

export const useAdminDashboardStats = (year: number) => {
    return useQuery({
        queryKey: ["admin-dashboard-stats", year],
        queryFn: async () => {
            const response = await axiosInstance.get(FINANCE_ROUTES.DASHBOARD_STATS, { params: { year } });
            return response.data.data;
        }
    });
};

export const useRecentTransactions = (params: { page: number; limit: number; search?: string }) => {
    return useQuery({
        queryKey: ["recent-transactions", params],
        queryFn: async () => {
            const response = await axiosInstance.get(FINANCE_ROUTES.TRANSACTIONS, { params });
            return response.data.data;
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

export const useHandlePayout = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, status }: { id: string, status: 'Success' | 'Failed' }) => {
            const response = await axiosInstance.patch(`${FINANCE_ROUTES.BASE}/payout/${id}`, { status });
            return response.data;
        },
        onSuccess: () => {
            toast.success("Payout processed and trainer wallet updated!");
            queryClient.invalidateQueries({ queryKey: ["adminFinanceOverview"] });
        }
    });
};
