import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import {
  CustomError,
  RegisterUserDto,
  LoginUserDto,
  UserEntity,
} from "../../domain";

export class AuthService {
  constructor(private readonly jwtAdapter: JwtAdapter) {}

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
}
