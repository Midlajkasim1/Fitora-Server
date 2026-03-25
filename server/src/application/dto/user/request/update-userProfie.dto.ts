import { ExperienceLevel } from "@/domain/constants/auth.constants";


export class UpdateUserProfileRequest {
  id!: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  preferredWorkouts?: string[];
  experienceLevel?: ExperienceLevel;

  constructor(data: UpdateUserProfileRequest) {
    Object.assign(this, data);
  }
}