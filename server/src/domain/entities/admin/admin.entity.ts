import { AdminRole, AdminStatus } from "@/domain/constants/auth.constants";
export class AdminEntity {
  private readonly _id?: string;
  private readonly _email: string;
  private readonly _status: AdminStatus;
  private readonly _role: AdminRole;

  private constructor(props: {
    id?: string;
    email: string;
    status: AdminStatus;
    role:AdminRole;
  }) {
    this._id = props.id;
    this._email = props.email;
    this._status = props.status;
    this._role= props.role;
  }

  static create(props: {
    id?: string;
    email: string;
    status?: AdminStatus;
    role: AdminRole
  }) {
    return new AdminEntity({
      ...props,
      status: props.status ?? AdminStatus.ACTIVE,role: AdminRole.ADMIN,
    });
  }

  get id() { return this._id; }
  get email() { return this._email; }
  get status() { return this._status; }
  get role() { return this._role; } 

  isActive() {
    return this._status === AdminStatus.ACTIVE;
  }
}
