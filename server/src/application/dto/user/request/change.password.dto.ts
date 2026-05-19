export class ChangePasswordRequest {
  userId!: string;
  currentPassword!: string;
  newPassword!: string;

  constructor(data: ChangePasswordRequest) {
    Object.assign(this, data);
  }
}