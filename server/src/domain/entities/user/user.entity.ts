import { UserRole, UserStatus } from "../../constants/auth.constants";


export class UserEntity {
  private readonly _id?: string;
  private readonly _email: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _phone: string;
  private readonly _role: UserRole;
  private readonly _status: UserStatus;
  private readonly _isEmailVerified: boolean;
  private readonly _dob?: Date;
  private readonly _gender?: string;
  private readonly _isOnboardingRequired: boolean;

  private constructor(props: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    isEmailVerified: boolean;
    dob?: Date;               
    gender?: string;          
    isOnboardingRequired: boolean; 

  }) {
    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._phone = props.phone;
    this._role = props.role;
    this._status = props.status;
    this._isEmailVerified = props.isEmailVerified;
    this._dob = props.dob;
    this._gender = props.gender;
    this._isOnboardingRequired = props.isOnboardingRequired;
    
  }

  static create(props: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    status?: UserStatus;
    isEmailVerified?: boolean;
    dob?: Date;
    gender?: string;
    isOnboardingRequired?: boolean;

  }): UserEntity {
    return new UserEntity({
      ...props,
      status: props.status ?? UserStatus.ACTIVE,
      isEmailVerified: props.isEmailVerified ?? false,
      isOnboardingRequired: props.isOnboardingRequired ?? true,
    });
  }

  get id() { return this._id; }
  get email() { return this._email; }
  get firstName() { return this._firstName; }
  get lastName() { return this._lastName; }
  get phone() { return this._phone; }
  get role() { return this._role; }
  get status() { return this._status; }
  get isEmailVerified() { return this._isEmailVerified; }
  get dob() { return this._dob; }
  get gender() { return this._gender; }
  get isOnboardingRequired() { return this._isOnboardingRequired; }

  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }
  isverfied(): boolean {
    return this._isEmailVerified;
  }


}
