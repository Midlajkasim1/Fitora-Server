import { ApprovalStatus } from "@/domain/enum/user/trainer-details.enum";

export class TrainerDetailsEntity {
  private readonly _id?: string;
  private readonly _userId: string;
  private readonly _bio: string;
  private readonly _experienceYear: number;
  private readonly _certifications: string[];
  private readonly _specializations: string[];
  private readonly _approvalStatus: ApprovalStatus;

  constructor(props: {
    id?: string;
    userId: string;
    bio: string;
    experienceYear: number;
    certifications: string[];
    specializations: string[];
    approvalStatus: ApprovalStatus;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._bio = props.bio;
    this._experienceYear = props.experienceYear;
    this._certifications = props.certifications;
    this._specializations = props.specializations;
    this._approvalStatus = props.approvalStatus;
  }

  static create(props: {
    userId: string;
    bio: string;
    experienceYear: number;
    certifications: string[];
    specializations: string[];
  }): TrainerDetailsEntity {
    return new TrainerDetailsEntity({
      ...props,
      approvalStatus: ApprovalStatus.PENDING 
    });
  }

  get id() { return this._id; }
  get userId() { return this._userId; }
  get bio() { return this._bio; }
  get experienceYear() { return this._experienceYear; }
  get certifications() { return this._certifications; }
  get specializations() { return this._specializations; }
  get approvalStatus() { return this._approvalStatus; }
}