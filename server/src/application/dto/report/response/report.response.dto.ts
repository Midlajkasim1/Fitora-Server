import { ReportStatus, ReportType } from "@/domain/constants/report.constants";

export interface ReportResponseDTO {
    id: string;
    reporterId: string;
    reporter: {
        name: string;
        role: "User" | "Trainer";
        profileImage?: string | null;
    };
    reportedId: string;
    reportedName?: string;
    type: ReportType;
    status: ReportStatus;
    description: string;
    resolutionNotes?: string;
    createdAt: Date;
    updatedAt: Date;
}

