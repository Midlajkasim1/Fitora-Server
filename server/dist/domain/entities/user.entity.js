"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
class UserEntity {
    _id;
    _email;
    _firstName;
    _lastName;
    _phone;
    _role;
    _status;
    _isEmailVerified;
    constructor(props) {
        this._id = props.id;
        this._email = props.email;
        this._firstName = props.firstName;
        this._lastName = props.lastName;
        this._phone = props.phone;
        this._role = props.role;
        this._status = props.status;
        this._isEmailVerified = props.isEmailVerified;
    }
    static create(props) {
        return new UserEntity({
            ...props,
            status: props.status ?? "active",
            isEmailVerified: props.isEmailVerified ?? false,
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
    isActive() {
        return this._status === "active";
    }
    isverfied() {
        return this._isEmailVerified;
    }
}
exports.UserEntity = UserEntity;
