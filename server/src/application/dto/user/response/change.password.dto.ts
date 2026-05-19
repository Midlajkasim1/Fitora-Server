

export class ChangePasswordResponse {
  message!: string;

  constructor(data: ChangePasswordResponse) {
    Object.assign(this, data);
  }
}