export class GetUserProfileResponse {
  id!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  profileImage?: string;
  gender?: string;
  preferredWorkouts?: string[];
  experienceLevel?: string;
  status?: string;

  constructor(data: GetUserProfileResponse) {
    Object.assign(this, data);
  }
}