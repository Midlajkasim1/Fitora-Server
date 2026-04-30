import { REPORT_ROUTES } from "../constants/api.constants";
import api from "./axios";

export const createIncidentReport = (data: {
    reportedId: string;
    type: string;
    description: string;
    sessionId?: string;
}) => {
    return api.post(REPORT_ROUTES.CREATE, data);
};

export const getAdminReports = (params: {
    page: number;
    limit: number;
    status?: string;
    type?: string;
    search?: string;
}) => {
    return api.get(REPORT_ROUTES.ADMIN_LIST, { params });
};

export const getAdminReportsSummary = () => {
    return api.get(REPORT_ROUTES.ADMIN_SUMMARY);
};

export const getAdminReportById = (id: string) => {
    return api.get(REPORT_ROUTES.ADMIN_GET_DETAILS(id));
};

export const updateReportStatus = (id: string, status: string, resolutionNotes?: string) => {
    return api.patch(REPORT_ROUTES.ADMIN_UPDATE_STATUS(id), { status, resolutionNotes });
};
