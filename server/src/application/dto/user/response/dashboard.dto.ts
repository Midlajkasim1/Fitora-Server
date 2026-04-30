import { BMIStatus } from "@/domain/constants/health.metrics.constants";

export interface UserDashboardResponseDTO {
    welcomeName: string;
    showWeightModal: boolean;
    metrics: {
        weight: number;
        height: number;
        age: number;
        bodyFat: number;
        primaryGoal:string;
    };
    bmi: {
        value: number;
        status: BMIStatus;
    };
    weightLoss: {
        current: number;
        target: number;
        progressPercentage: number;
    };
    monthlyProgress: {
        day: string;
        value: number;
    }[];
    nextSession: {
        slotId: string;
        trainerId: string;
        startTime: Date;
        trainerName: string;
        type: string;
    } | null;
    sessionsPerDay: {
        day: string;
        value: number;
    }[];
    totalSessionsAttended: number;
    totalSubscriptionSessions: number;
    sessionsLeft: number;
}