export type UserRole = "user" | "trainer";
export type UserStatus = "active" | "blocked";

export class UserEntity {
  private readonly _id?: string;
  private readonly _email: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _phone: string;
  private readonly _role: UserRole;
  private readonly _status: UserStatus;
   private readonly _isVerified: boolean;


  private constructor(props: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
     isVerified: boolean;

  }) {
    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._phone = props.phone;
    this._role = props.role;
    this._status = props.status;
     this._isVerified = props.isVerified;

  }

  static create(props: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    status?: UserStatus;
    isVerified?: boolean;

  }): UserEntity {
    return new UserEntity({
      ...props,
      status: props.status ?? "active",
      isVerified: props.isVerified ?? false,
    });
  }

  get id() { return this._id }
  get email() { return this._email }
  get firstName() { return this._firstName }
  get lastName() { return this._lastName }
  get phone() { return this._phone }
  get role() { return this._role }
  get status() { return this._status }
  get isVerified() { return this._isVerified }


  isActive(): boolean {
    return this._status === "active";
  }
   isEmailVerified(): boolean {
    return this._isVerified;
  }
}
