
export class TrainerOnboardingDTO {
  userId!: string;
  bio!: string;
  experience_year!: number;
  gender!: string;
  certifications!: string[];
  specializations!: string;
  authenticatedSessionId?: string;

  constructor(data: TrainerOnboardingDTO) {
    Object.assign(this, data);
  }
}