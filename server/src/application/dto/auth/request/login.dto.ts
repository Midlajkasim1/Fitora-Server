// export interface LoginDTO{
//     email:string;
//     password:string
// }
export class LoginDTO {
  email!: string;
  password!: string;

  constructor(data: LoginDTO) {
    Object.assign(this, data);
  }
}