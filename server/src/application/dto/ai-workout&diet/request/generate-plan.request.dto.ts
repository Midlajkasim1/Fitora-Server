import { IUserFitnessMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";

export class GenerateWorkoutRequestDTO {
  userId!: string;
  metrics!: IUserFitnessMetrics;

  constructor(data: GenerateWorkoutRequestDTO) {
    Object.assign(this, data);
  }
}