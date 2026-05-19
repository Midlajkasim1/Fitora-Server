export class AdminLoginDTO {
  email!: string;
  password!: string;

  constructor(data: AdminLoginDTO) {
    Object.assign(this, data);
  }
}