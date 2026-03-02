import { ApprovalStatus, UserRole, UserStatus } from "../../constants/auth.constants";


export class UserEntity {
  private readonly _id?: string;
  private readonly _email: string;
  private readonly _firstName: string;
  private readonly _lastName: string;
  private readonly _phone: string;
  private readonly _role: UserRole;
  private          _status: UserStatus;
  private readonly _profileImage?: string;
  private readonly _isEmailVerified: boolean;
  private readonly _dob?: Date;
  private readonly _gender?: string;
  private readonly _isOnboardingRequired: boolean;
  private          _approvalStatus: ApprovalStatus;
  private _createdAt ?: Date;

  private constructor(props: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    profileImage?:string;
    isEmailVerified: boolean;
    dob?: Date;               
    gender?: string;          
    isOnboardingRequired: boolean; 
    approvalStatus: ApprovalStatus;
    createdAt?:Date;

  }) {
    this._id = props.id;
    this._email = props.email;
    this._firstName = props.firstName;
    this._lastName = props.lastName;
    this._phone = props.phone;
    this._role = props.role;
    this._status = props.status;
    this._profileImage = props.profileImage;
    this._isEmailVerified = props.isEmailVerified;
    this._dob = props.dob;
    this._gender = props.gender;
    this._isOnboardingRequired = props.isOnboardingRequired;
    this._approvalStatus = props.approvalStatus;
    this._createdAt = props.createdAt || new Date();
    
  }

  static create(props: {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    profileImage?:string;
    status?: UserStatus;
    isEmailVerified?: boolean;
    dob?: Date;
    gender?: string;
    isOnboardingRequired?: boolean;
    approvalStatus?: ApprovalStatus;
    createdAt?:Date;

  }): UserEntity {
    return new UserEntity({
      ...props,
      status: props.status ?? UserStatus.ACTIVE,
      isEmailVerified: props.isEmailVerified ?? false,
      isOnboardingRequired: props.isOnboardingRequired ?? true,
      approvalStatus: props.approvalStatus ?? ApprovalStatus.PENDING,
    });
  }

  get id() { return this._id; }
  get email() { return this._email; }
  get firstName() { return this._firstName; }
  get lastName() { return this._lastName; }
  get phone() { return this._phone; }
  get role() { return this._role; }
  get status() { return this._status; }
  get profileImage() { return this._profileImage; }
  get isEmailVerified() { return this._isEmailVerified; }
  get dob() { return this._dob; }
  get gender() { return this._gender; }
  get isOnboardingRequired() { return this._isOnboardingRequired; }
  get approvalStatus() { return this._approvalStatus; }
  get createdAt() {return this._createdAt;}

  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }
  isverfied(): boolean {
    return this._isEmailVerified;
  }
  toggleStatus(): void {
    this._status = this._status === UserStatus.ACTIVE 
      ? UserStatus.BLOCKED 
      : UserStatus.ACTIVE;
  }


}
