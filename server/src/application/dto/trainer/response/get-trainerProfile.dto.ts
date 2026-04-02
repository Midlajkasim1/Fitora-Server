export class GetTrainerProfileResponse {
  id!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  profileImage?: string;
  experience_year?: number;
  status?: string;

  constructor(data: GetTrainerProfileResponse) {
    Object.assign(this, data);
  }
}