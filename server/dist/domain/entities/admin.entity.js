"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminEntity = void 0;
class AdminEntity {
    _id;
    _email;
    _status;
    constructor(props) {
        this._id = props.id;
        this._email = props.email;
        this._status = props.status;
    }
    static create(props) {
        return new AdminEntity({
            ...props,
            status: props.status ?? "active",
        });
    }
    get id() { return this._id; }
    get email() { return this._email; }
    get status() { return this._status; }
    isActive() {
        return this._status === "active";
    }
}
exports.AdminEntity = AdminEntity;
