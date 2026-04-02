export class UpdateTrainerProfileRequest {
  id!: string;
  firstName!: string;
  lastName!: string;
  phone?: string;
  profileImage?: string;
  experience_year?: number;

  constructor(data: UpdateTrainerProfileRequest) {
    Object.assign(this, data);
  }
}