export enum SlotStatus {
    AVAILABLE = "available",
    BOOKED = "booked",
    LIVE = "live",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

export enum SessionType {
    ONE_ON_ONE = "one_on_one",
    GROUP = "group"
}

export enum AttendanceStatus {
    PENDING = "PENDING",
    ATTENDED = "ATTENDED",
    COMPLETED = "COMPLETED"
}

export const MIN_SUCCESS_THRESHOLD = 10; // 10 seconds threshold for payout eligibility