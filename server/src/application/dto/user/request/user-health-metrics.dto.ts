export interface SaveHealthMetricsRequestDTO {
  userId: string;
  height: number;
  weight: number;
  targetWeight: number;
  primaryGoal: string;
}