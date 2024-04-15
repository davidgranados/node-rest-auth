import { CustomError } from "../errors/custom.error";

export class UserEntity {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public emailValidated: string,
    public password: string,
    public role: string[],
    public img?: string
  ) {}

  static fromObject(obj: any): UserEntity {
    const { id, _id, name, email, emailValidated, password, role, img } = obj;
    if (!id && !_id) {
      throw CustomError.badRequest("Id is required");
    }
    if (!name) {
      throw CustomError.badRequest("Name is required");
    }
    if (!email) {
      throw CustomError.badRequest("Email is required");
    }
    if (emailValidated === undefined) {
      throw CustomError.badRequest("Email validated is required");
    }
    if (!password) {
      throw CustomError.badRequest("Password is required");
    }
    if (!role) {
      throw CustomError.badRequest("Role is required");
    }
    return new UserEntity(id ?? id, name, email, emailValidated, password, role, img);
  }
}
