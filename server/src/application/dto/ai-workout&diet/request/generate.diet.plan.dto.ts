import { IUserDietMetrics } from "@/domain/interfaces/services/ai-generate.service.interface";

export class GenerateDietRequestDTO {
  userId!: string;
  metrics?: Partial<IUserDietMetrics>;

  constructor(data: GenerateDietRequestDTO) {
    Object.assign(this, data);
  }
}