import { AdminStatus } from "../constants/auth.constants";
export class AdminEntity {
  private readonly _id?: string;
  private readonly _email: string;
  private readonly _status: AdminStatus;

  private constructor(props: {
    id?: string;
    email: string;
    status: AdminStatus;
  }) {
    this._id = props.id;
    this._email = props.email;
    this._status = props.status;
  }

  static create(props: {
    id?: string;
    email: string;
    status?: AdminStatus;
  }) {
    return new AdminEntity({
      ...props,
      status: props.status ?? AdminStatus.ACTIVE,
    });
  }

  get id() { return this._id }
  get email() { return this._email }
  get status() { return this._status }

  isActive() {
    return this._status === AdminStatus.ACTIVE;
  }
}
