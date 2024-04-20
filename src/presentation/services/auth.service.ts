import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  RegisterUserDto,
  LoginUserDto,
  UserEntity,
} from "../../domain";
import { EmailService } from "./email.service";
import { envs } from "../../config";

export class AuthService {
  constructor(
    private readonly jwtAdapter: JwtAdapter,
    private readonly emailService: EmailService
  ) {}

  private sendEmailValidationLink = async (email: string) => {
    const token = await this.jwtAdapter.sign({ email });
    if (!token) {
      throw CustomError.internal("Internal server error");
    }

    const link = `${envs.HOST}/api/auth/validate-email/${token}`;
    const html = `<a href="${link}">Click here to validate your email</a>`;
    const subject = "Email validation link";

    const emailSent = await this.emailService.sendEmail({
      to: email,
      subject,
      htmlBody: html,
    });

    if (!emailSent) {
      throw CustomError.internal("Internal server error");
    }

    return true;
  };

  public async registerUser(registerUserDto: RegisterUserDto) {
    const userExists = await UserModel.findOne({
      email: registerUserDto.email,
    });
    if (userExists) {
      throw CustomError.badRequest("User already exists");
    }

    try {
      const user = new UserModel(registerUserDto);

      user.password = bcryptAdapter.hash(user.password);

      await user.save();

      await this.sendEmailValidationLink(user.email);

      const { password: _, ...useEntity } = UserEntity.fromObject(user);
      const token = await this.jwtAdapter.sign({ id: user.id });

      if (!token) {
        throw CustomError.internal("Internal server error");
      }
      return {
        user: useEntity,
        token,
      };
    } catch (error) {
      throw CustomError.internal(`${error}`);
    }
  }

  public async loginUser(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw CustomError.badRequest("invalid email or password");
    }
    const passwordMatch = bcryptAdapter.compare(password, user.password);
    if (!passwordMatch) {
      throw CustomError.badRequest("invalid email or password");
    }
    const { password: _, ...useEntity } = UserEntity.fromObject(user);
    const token = await this.jwtAdapter.sign({ id: user.id });

    if (!token) {
      throw CustomError.internal("Internal server error");
    }

    return {
      user: useEntity,
      token,
    };
  }

  public validateEmail = async (token: string) => {
    const jwtPayload = this.jwtAdapter.verify(token);
    if (!jwtPayload) {
      throw CustomError.badRequest("Invalid token");
    }

    if (typeof jwtPayload === 'string') {
      throw CustomError.badRequest("Invalid token");
    }

    const email = jwtPayload.email;

    if (!email) {
      throw CustomError.badRequest("Invalid token");
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw CustomError.notFound("User not found");
    }

    user.emailValidated = true;
    await user.save();

    const { password: _, ...useEntity } = UserEntity.fromObject(user);
    const newToken = await this.jwtAdapter.sign({ id: user.id });

    if (!newToken) {
      throw CustomError.internal("Internal server error");
    }

    return {
      user: useEntity,
      token: newToken,
    };
  };
}
