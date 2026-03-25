
export class TrainerOnboardingDTO {
  userId!: string;
  bio!: string;
  experience_year!: number;
  gender!: string;
  certifications!: string[];
  specializations!: string[];

  constructor(data: TrainerOnboardingDTO) {
    Object.assign(this, data);
  }
}