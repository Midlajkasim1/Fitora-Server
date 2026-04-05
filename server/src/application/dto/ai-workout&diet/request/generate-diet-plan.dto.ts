import { IUserDietMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";

export class GenerateDietRequestDTO {
  userId!: string;
  metrics!: IUserDietMetrics;

  constructor(data: GenerateDietRequestDTO) {
    Object.assign(this, data);
  }
}