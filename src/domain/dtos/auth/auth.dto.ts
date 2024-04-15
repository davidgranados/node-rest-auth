import { regex } from "../../../config";

export class RegisterUserDto {
  private constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string
  ) {}

  static create(obj: { [key: string]: any }): [string | null, RegisterUserDto?] {
    const { name, email, password } = obj;
    if (!name) {
      return ["name is required"];
    }
    if (!email) {
      return ["email is required"];
    } else if (!regex.email.test(email)) {
      return ["email is invalid"];
    }
    if (!password) {
      return ["password is required"];
    } else if (!regex.password.test(password)) {
      return ["password is invalid"];
    }

    return [null, new RegisterUserDto(name, email, password)];
  }
}

export class LoginUserDto {
  private constructor(public readonly email: string, public readonly password: string) {}

  static create(obj: { [key: string]: any }): [string | null, LoginUserDto?] {
    const { email, password } = obj;
    if (!email) {
      return ["email is required"];
    } else if (!regex.email.test(email)) {
      return ["email is invalid"];
    }
    if (!password) {
      return ["password is required"];
    }

    return [null, new LoginUserDto(email, password)];
  }
}
