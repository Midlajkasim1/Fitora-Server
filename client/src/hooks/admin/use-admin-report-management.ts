import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAdminReports, getAdminReportsSummary, updateReportStatus, getAdminReportById } from "../../api/incident.api";

import toast from "react-hot-toast";

export const useReportManagement = (params: {
    page: number;
    status?: string;
    type?: string;
    search?: string;
}) => {
    return useQuery({
        queryKey: ["admin-reports", params],
        queryFn: async () => {
            const response = await getAdminReports({
                page: params.page,
                limit: 10,
                status: params.status || undefined,
                type: params.type || undefined,
                search: params.search || undefined
            });
            return response.data.data;
        }
    });
};

export const useReportSummary = () => {
    return useQuery({
        queryKey: ["admin-reports-summary"],
        queryFn: async () => {
            const response = await getAdminReportsSummary();
            return response.data.data;
        }
    });
};

export const useReportDetails = (id: string) => {
    return useQuery({
        queryKey: ["admin-reports", id],
        queryFn: async () => {
            const response = await getAdminReportById(id);
            return response.data.data;
        },
        enabled: !!id
    });
};

export const useUpdateReportStatus = () => {

    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async ({ id, status, resolutionNotes }: { id: string; status: string; resolutionNotes?: string }) => {
            const response = await updateReportStatus(id, status, resolutionNotes);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-reports"] });
            queryClient.invalidateQueries({ queryKey: ["admin-reports-summary"] });
            toast.success("Report status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    });
};
