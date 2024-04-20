import { Request, Response } from "express";
import { CustomError, LoginUserDto, RegisterUserDto } from "../../domain";
import { AuthService } from "../services/auth.service";

export class AuthController {
  constructor(public readonly authService: AuthService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  };

  register = (req: Request, res: Response) => {
    const [error, registerUserDto] = RegisterUserDto.create(req.body);
    if (error) {
      return res.status(400).json({ message: error });
    }
    if (!registerUserDto) {
      return res.status(500).json({ message: "Internal server error" });
    }

    this.authService
      .registerUser(registerUserDto)
      .then((user) => {
        res.status(201).json(user);
      })
      .catch((error) => this.handleError(error, res));
  };

  login = (req: Request, res: Response) => {
    const [error, loginUserDto] = LoginUserDto.create(req.body);

    if (error) {
      return res.status(400).json({ message: error });
    }

    if (!loginUserDto) {
      return res.status(500).json({ message: "Internal server error" });
    }

    this.authService
      .loginUser(loginUserDto)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((error) => this.handleError(error, res));
  };

  validateEmail = (req: Request, res: Response) => {
    const { token } = req.params;
    this.authService
      .validateEmail(token)
      .then(({ user }) => {
        res.status(200).json(user);
      })
      .catch((error) => this.handleError(error, res));
  };
}
