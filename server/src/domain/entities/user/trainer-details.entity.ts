import { ApprovalStatus } from "@/domain/constants/auth.constants";

export class TrainerDetailsEntity {
  private readonly _id?: string;
  private readonly _userId: string;
  private readonly _bio: string;
  private readonly _experienceYear: number;
  private readonly _certifications: string[];
  private readonly _specializations: string;
  private readonly _approvalStatus: ApprovalStatus;
  private readonly _rejectionReason?: string | null;
  private readonly _averageRating: number;
  private readonly _reviewCount: number;
  private readonly _walletBalance: number;
  private readonly _createdAt?: Date;

  constructor(props: {
    id?: string;
    userId: string;
    bio: string;
    experienceYear: number;
    certifications: string[];
    specializations: string;
    approvalStatus: ApprovalStatus;
    rejectionReason?:string | null;
    averageRating?: number;
    reviewCount?: number;
    walletBalance?: number;
    createdAt?:Date;
  }) {
    this._id = props.id;
    this._userId = props.userId;
    this._bio = props.bio;
    this._experienceYear = props.experienceYear;
    this._certifications = props.certifications;
    this._specializations = props.specializations;
    this._approvalStatus = props.approvalStatus;
    this._rejectionReason = props.rejectionReason ?? null;
    this._averageRating = props.averageRating ?? 0;
    this._reviewCount = props.reviewCount ?? 0;
    this._walletBalance = props.walletBalance ?? 0;
    this._createdAt = props.createdAt;
  }

  static create(props: {
    userId: string;
    bio: string;
    experienceYear: number;
    certifications: string[];
    specializations: string;
  }): TrainerDetailsEntity {
    return new TrainerDetailsEntity({
      ...props,
      approvalStatus: ApprovalStatus.PENDING,
      averageRating: 0,
      reviewCount: 0,
      walletBalance: 0
    });
  }

  get id() { return this._id; }
  get userId() { return this._userId; }
  get bio() { return this._bio; }
  get experienceYear() { return this._experienceYear; }
  get certifications() { return this._certifications; }
  get specializations() { return this._specializations; }
  get approvalStatus() { return this._approvalStatus; }
  get rejectionReason(){return this._rejectionReason;}
  get averageRating() { return this._averageRating; }
  get reviewCount() { return this._reviewCount; }
  get walletBalance() { return this._walletBalance; }
  get createdAt(){return this._createdAt;}
}